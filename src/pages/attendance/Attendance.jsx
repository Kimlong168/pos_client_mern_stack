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
  useAttendances,
  useDeleteAttendance,
} from "@/hooks/attendance/useAttendance";
import { AttendanceContext } from "@/contexts/AttendanceContext";

const Attendance = () => {
  const { data, isLoading } = useAttendances();
  const deleteAttendance = useDeleteAttendance();

  const {
    state: attendances,
    dispatch,
    removeAttendance,
    searchAttendance,
  } = useContext(AttendanceContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    }
  }, [data, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    } else {
      searchAttendance(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteAttendance.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeAttendance(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  return (
    <div>
      {/* page title */}
      <PageTitle title={`Attendances (${attendances?.length || 0})`} link="#" />

      {/* search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-5 py-5 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={attendances?.length}
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
            "Employee",
            "Time In",
            "Time Out",
            "Date",
            "Location",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={6} />
          ) : (
            <>
              {attendances?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={6}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={attendances}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={6}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Attendance;
