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

import { LeaveRequestContext } from "@/contexts/LeaveRequestContext";
import { useLeaveRequests } from "@/hooks/leaveRequest/useLeaveRequest";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import SelectFilter from "@/components/form/SelectFilter";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useUsers } from "@/hooks/user/useUser";
import { handleDeleteFunction } from "@/utils/handleDeleteFunction";
import { notify } from "@/utils/toastify";
import { useClearAllLeaveRequests } from "@/hooks/leaveRequest/useLeaveRequest";
import { useNavigate } from "react-router-dom";
const LeaveRequest = () => {
  const { data, isLoading , isError} = useLeaveRequests();
  const { data: users, isLoading: isUserLoading } = useUsers();
  const clearAllLeaveRequests = useClearAllLeaveRequests();
  const {
    state: leaveRequests,
    dispatch,
    searchLeaveRequest,
  } = useContext(LeaveRequestContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );
  const navigate = useNavigate();

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_LEAVE_REQUEST", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByEmployee = (employee) => {
    if (employee === "all") {
      dispatch({ type: "SET_LEAVE_REQUEST", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.employee?._id === employee
      );
      dispatch({ type: "SET_LEAVE_REQUEST", payload: filteredData });
    }
  };

  const handleFilterByDate = (date) => {
    if (date === "all") {
      dispatch({ type: "SET_LEAVE_REQUEST", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const requestDate = new Date(item.created_at);
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
          return requestDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return requestDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return requestDate >= startOfWeek && requestDate <= endOfWeek;
        } else if (date === "last_week") {
          return requestDate >= startOfLastWeek && requestDate < startOfWeek;
        } else if (date === "this_month") {
          return requestDate >= startOfMonth && requestDate <= endOfMonth;
        } else if (date === "last_month") {
          return (
            requestDate >= startOfLastMonth && requestDate <= endOfLastMonth
          );
        } else if (date === "this_year") {
          return requestDate >= startOfYear && requestDate <= endOfYear;
        } else {
          // Last 6 months
          return requestDate >= startOfLast6Months && requestDate <= today;
        }
      });

      dispatch({ type: "SET_LEAVE_REQUEST", payload: filteredData });
    }
  };

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      dispatch({ type: "SET_LEAVE_REQUEST", payload: data });
    } else {
      const filteredData = data.filter((item) => item.status === status);
      dispatch({ type: "SET_LEAVE_REQUEST", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_LEAVE_REQUEST", payload: data });
    } else {
      searchLeaveRequest(searchKeyWord);
    }
  };

  const handleClearAll = async () => {
    handleDeleteFunction(async () => {
      try {
        const result = await clearAllLeaveRequests.mutateAsync();

        if (result.status === "success") {
          notify("Clear all leave requests successfully", "success");
          navigate("/leaveRequest");
        } else {
          notify("result.error.message", "error");

          console.error("Error deleting item:", result.error.message);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Clear all fail!", "error");
      }
    }, "Are you sure you want to clear all leave requests? Once deleted, you will not be able to recover this data!");
  };

  const dataToExport = leaveRequests.map((item, index) => {
    return {
      No: index + 1,
      Employee: item.employee?.name + `(${item.employee?.role})`,
      Type: item.type,
      Status: item.status,
      "Leave Date": `${getFormattedDate(item.start_date)} - ${getFormattedDate(
        item.end_date
      )}`,
      Reason: item.reason,
      "Approved By": item.approvedOrRejectedBy
        ? item.approvedOrRejectedBy?.name +
          `(${item.approvedOrRejectedBy?.role})`
        : "Not Yet",
      "Request Date": getFormattedDate(item.created_at),
    };
  });

  if(isError){
    return <div>Error...</div>
  }


  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Leave Requests (${leaveRequests?.length || 0})`}
        link="#"
      />

      {/* search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-5 py-5 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={leaveRequests?.length}
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
                value: "Approved",
                label: "Approved",
              },
              {
                value: "Rejected",
                label: "Rejected",
              },
              {
                value: "Pending",
                label: "Pending",
              },
            ]}
          />
        </div>
        <div>
          <label>
            <span className="text-gray-700">Number of Status</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500/20 border-orange-500 text-orange-500 px-2  rounded w-[120px] text-center border p-2">
              Pending:{" "}
              {leaveRequests.filter((item) => item.status === "Pending")
                .length || "0"}
            </div>
            <div className="bg-green-600/20 border-green-600 text-green-600 px-2  rounded w-[120px] text-center border p-2">
              Approved:{" "}
              {leaveRequests.filter((item) => item.status === "Approved")
                .length || "0"}
            </div>
            <div className="bg-red-500/20 border-red-500 text-red-500 px-2  rounded w-[120px] text-center border p-2">
              Rejected:{" "}
              {leaveRequests.filter((item) => item.status === "Rejected")
                .length || "0"}
            </div>
          </div>
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
            <span className="text-gray-700">Request Date</span>
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
              fileName={`Leave_request_${new Date().toLocaleDateString()}`}
            />
            <ExportToPDF
              data={dataToExport}
              fileName={`Leave_request_${new Date().toLocaleDateString()}`}
            />
          </div>
        </div>

        <div>
          <label>Clear all (expired only)</label>
          <div
            onClick={handleClearAll}
            className="w-fit cursor-pointer bg-red-500 hover:bg-red-600 p-2 rounded text-white"
          >
            Clear all Now☢️
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Employee",
            "Type",
            "Status",
            "Leave Date",
            "Reason",
            "Approved By",
            "Request Date",
            "Comment",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={8} />
          ) : (
            <>
              {leaveRequests?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={8}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={leaveRequests}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={8}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaveRequest;
