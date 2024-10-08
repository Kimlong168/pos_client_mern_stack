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

import {
  useSuppliers,
  useDeleteSupplier,
} from "../../hooks/supplier/useSupplier";
import { SupplierContext } from "../../contexts/SupplierContext";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";

const Supplier = () => {
  const { data, isLoading } = useSuppliers();
  const deleteSupplier = useDeleteSupplier();

  const {
    state: suppliers,
    dispatch,
    removeSupplier,
    searchSupplier,
  } = useContext(SupplierContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_SUPPLIER", payload: data });
    }
  }, [data, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_SUPPLIER", payload: data });
    } else {
      searchSupplier(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteSupplier.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeSupplier(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  const dataToExport = suppliers?.map((supplier, index) => ({
    No: index + 1,
    Name: supplier.name,
    Phone: supplier.contact_info?.phone,
    Email: supplier.contact_info?.email,
    Address:
      supplier.contact_info?.address.city +
      ", " +
      supplier.contact_info?.address.country,
  }));

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Suppliers (${suppliers?.length || 0})`}
        link="/createSupplier"
      />

      {/* search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-5 mt-5 mb-2 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={suppliers?.length}
        />

        <SearchBar
          handleSearch={handleSearch}
          setSearchKeyWord={setSearchKeyWord}
          searchKeyWord={searchKeyWord}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="">Export to</label>
        <div className="flex gap-2">
          <ExportToExcel
            data={dataToExport}
            fileName={`List of Suppliers - ${new Date().toLocaleDateString()}`}
          />
          <ExportToPDF
            data={dataToExport}
            fileName={`List of Suppliers - ${new Date().toLocaleDateString()}`}
          />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Name",
            "Phone",
            "Email",
            "Chat ID",
            "Address",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={7} />
          ) : (
            <>
              {suppliers?.length == 0 ? (
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
                  data={suppliers}
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

export default Supplier;
