import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";
import {
  getFormattedDate,
  getFormattedTimeWithAMPM,
} from "@/utils/getFormattedDate";
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
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import SelectFilter from "@/components/form/SelectFilter";
import { useUsers } from "@/hooks/user/useUser";

const Attendance = () => {
  const { data, isLoading, isError } = useAttendances();
  const { data: users, isLoading: isUserLoading } = useUsers();
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

  const handleFilterByEmployee = (employee) => {
    if (employee === "all") {
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.employee?._id === employee
      );
      dispatch({ type: "SET_ATTENDANCE", payload: filteredData });
    }
  };

  const handleFilterByDate = (date) => {
    if (date === "all") {
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const recordDate = new Date(item.date);
        const today = new Date();

        // Calculate relevant date ranges
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
        ); // Start from Monday

        const endOfWeek = today; // End on today

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7); // Last week starts

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = today; // Current date

        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ); // Last day of last month

        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = today; // Current date

        // Calculate the start date for last 6 months
        const startOfLast6Months = new Date(today);
        startOfLast6Months.setMonth(today.getMonth() - 6);

        // Filtering based on the date parameter
        if (date === "today") {
          return recordDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return recordDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return recordDate >= startOfWeek && recordDate <= endOfWeek;
        } else if (date === "last_week") {
          return recordDate >= startOfLastWeek && recordDate < startOfWeek;
        } else if (date === "this_month") {
          return recordDate >= startOfMonth && recordDate <= endOfMonth;
        } else if (date === "last_month") {
          return recordDate >= startOfLastMonth && recordDate <= endOfLastMonth;
        } else if (date === "this_year") {
          return recordDate >= startOfYear && recordDate <= endOfYear;
        } else {
          // Last 6 months
          return recordDate >= startOfLast6Months && recordDate <= today;
        }
      });

      dispatch({ type: "SET_ATTENDANCE", payload: filteredData });
    }
  };

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      dispatch({ type: "SET_ATTENDANCE", payload: data });
    } else {
      const filteredData = data.filter(
        (item) =>
          item.check_in_status === status || item.check_out_status === status
      );
      dispatch({ type: "SET_ATTENDANCE", payload: filteredData });
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

  const dataToExport = attendances.map((att, index) => {
    return {
      No: index + 1,
      ID: att._id,
      Employee: att.employee?.name,
      "Time In":
        getFormattedTimeWithAMPM(att.time_in) +
        " (" +
        att.check_in_status +
        ")",
      "Late Time": att.checkInLateDuration,
      "Time Out":
        getFormattedTimeWithAMPM(att.time_out) +
        " (" +
        att.check_out_status +
        ")",
      "Early Time": att.checkOutEarlyDuration,
      Date: getFormattedDate(att.date),
      Location: att.qr_code?.location,
    };
  });

  if (isError) {
    return <div>Error...</div>;
  }

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

      <div className="flex flex-row gap-3 items-center w-full mb-5">
        <div>
          <label>
            <span className="text-gray-700">Status</span>
          </label>
          <SelectFilter
            handleFilter={handleFilterByStatus}
            filterName={"status"}
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "On Time",
                label: "On Time",
              },
              {
                value: "Late",
                label: "Late",
              },
              {
                value: "Checked Out",
                label: "Checked Out",
              },
              {
                value: "Early Check-out",
                label: "Early Check-out",
              },
              {
                value: "Absent",
                label: "Absent",
              },
              {
                value: "Missed Check-out",
                label: "Missed Check-out",
              },
              {
                value: "On Leave",
                label: "On Leave",
              },
            ]}
          />
        </div>
        {!isUserLoading && (
          <div>
            <label>
              <span className="text-gray-700">Employee</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByEmployee}
              filterName={"employee"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                ...users
                  .filter(
                    (user) => user.role !== "admin" && user.role !== "manager"
                  )
                  .map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
              ]}
            />
          </div>
        )}
        <div>
          <label>
            <span className="text-gray-700">Date</span>
          </label>
          <SelectFilter
            handleFilter={handleFilterByDate}
            filterName={"date"}
            options={[
              {
                value: "all",
                label: "All",
              },
              {
                value: "today",
                label: "Today",
              },
              {
                value: "yesterday",
                label: "Yesterday",
              },
              {
                value: "this_week",
                label: "This Week",
              },
              {
                value: "last_week",
                label: "Last Week",
              },
              {
                value: "this_month",
                label: "This Month",
              },
              {
                value: "last_month",
                label: "Last Month",
              },
            ]}
          />
        </div>

        <div>
          <label htmlFor="">Export to</label>
          <div className="flex gap-2 w-full">
            <ExportToExcel
              data={dataToExport}
              fileName={`Attendance_${new Date().toLocaleDateString()}`}
            />
            <ExportToPDF
              data={dataToExport}
              fileName={`Attendance_${new Date().toLocaleDateString()}`}
            />
          </div>
        </div>
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
