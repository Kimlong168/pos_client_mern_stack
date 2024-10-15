import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";

import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";
import { notify } from "../../utils/toastify";
import { handleDeleteFunction } from "../../utils/handleDeleteFunction";
import { useDeleteQrcode, useQrcodes } from "@/hooks/qrcode/useQrcode";
import { QrcodeContext } from "@/contexts/QrocodeContext";

const QrCode = () => {
  const { data, isLoading, isError } = useQrcodes();
  const deleteCategory = useDeleteQrcode();

  const {
    state: qrcodes,
    dispatch,
    removeQrcode,
    searchQrcode,
  } = useContext(QrcodeContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_QRCODE", payload: data });
    }
  }, [data, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_QRCODE", payload: data });
    } else {
      searchQrcode(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteCategory.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeQrcode(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Qr-code (${qrcodes?.length || 0})`}
        link="/createQrcode"
      />

      {/* search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-5 py-5 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={qrcodes?.length}
        />

        <SearchBar
          handleSearch={handleSearch}
          setSearchKeyWord={setSearchKeyWord}
          searchKeyWord={searchKeyWord}
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Location",
            "Lat",
            "Lng",
            "Radius",
            "Qrcode",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={7} />
          ) : (
            <>
              {qrcodes?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={7}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={qrcodes}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={7}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QrCode;
