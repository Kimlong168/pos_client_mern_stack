import { AuthContext } from "@/contexts/AuthContext";
import {
  useLeaveRequestsByEmployeeId,
  useDeleteLeaveRequest,
  useCreateLeaveRequest,
  useUpdateLeaveRequest,
} from "@/hooks/leaveRequest/useLeaveRequest";
import { useContext, useEffect, useState } from "react";
import { getFormattedDate } from "@/utils/getFormattedDate";
import {
  IoIosArrowDropdown,
  IoIosArrowDropup,
  IoMdAddCircleOutline,
} from "react-icons/io";
import { handleDeleteFunction } from "@/utils/handleDeleteFunction";
import { notify } from "@/utils/toastify";
import getNumberOfDays from "@/utils/getNumberOfDays";
import { Link } from "react-router-dom";
import { MdOutlineArrowBackIos } from "react-icons/md";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";

const CrudLeaveRequest = () => {
  const { user } = useContext(AuthContext);
  const { data, isLoading, refetch } = useLeaveRequestsByEmployeeId(user._id);
  const deleteLeaveRequest = useDeleteLeaveRequest();
  const createLeaveRequest = useCreateLeaveRequest();
  const updateLeaveRequest = useUpdateLeaveRequest();
  const leaveTypes = ["Sick Leave", "Vacation", "Emergency Leave", "Other"];

  const [leaveRequest, setLeaveRequest] = useState({
    type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [expandIndex, setExpandIndex] = useState(0);

  useEffect(() => {
    if (data) {
      setLeaveRequests(data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeaveRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate data
    if (
      !leaveRequest.type ||
      !leaveRequest.start_date ||
      !leaveRequest.end_date ||
      !leaveRequest.reason
    ) {
      notify("Please fill all fields", "error");
      console.log("leaveRequest:", leaveRequest);
      return;
    }
    // start date must be greater than today
    if (new Date(leaveRequest.start_date) < new Date()) {
      notify("Start date must be greater than today", "error");
      return;
    }

    // check date
    if (new Date(leaveRequest.start_date) > new Date(leaveRequest.end_date)) {
      notify("Start date must be less than end date", "error");

      return;
    }

    // check if editing or adding
    if (parseInt(editingIndex) >= 0) {
      const updatedLeaves = leaveRequests.map((leave, index) =>
        index === editingIndex ? leaveRequest : leave
      );
      setLeaveRequests(updatedLeaves);
      setEditingIndex(-1);

      try {
        const result = await updateLeaveRequest.mutateAsync({
          id: leaveRequests[editingIndex]._id,
          ...leaveRequest,
        });

        if (result.status === "success") {
          notify("Update successfully", "success");
        } else {
          notify("Update fail!", "error");
        }
        console.log("Request item:", result);
      } catch (error) {
        notify("Update fail!", "error");
        console.error("Error Updating item:", error);
      }
    } else {
      try {
        const result = await createLeaveRequest.mutateAsync(leaveRequest);

        if (result.status === "success") {
          notify("Request successfully", "success");
          refetch();
        } else {
          notify(result.error.message, "info");
        }
        console.log("Request item:", result);
      } catch (error) {
        notify("Request fail!", "error");
        console.error("Error Requesting item:", error);
      }
    }

    setLeaveRequest({
      type: "",
      start_date: "",
      end_date: "",
      reason: "",
    });
  };

  const handleEdit = (index) => {
    setLeaveRequest(leaveRequests[index]);
    setEditingIndex(index);
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteLeaveRequest.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          refetch();
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
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

  return (
    <div
      className={`flex justify-center items-center relative min-h-screen bg-black/70 py-6`}
    >
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md relative m-2">
        <Link to="/user/profile">
          <button className="mt-4 flex items-center gap-2 text-white w-fit px-2 py-2 bg-red-500 hover:bg-orange-600 border border-white rounded-xl top-0 left-4 fixed">
            <MdOutlineArrowBackIos />
          </button>
        </Link>
        {/* update and create leave request form */}
        <div>
          <div className="flex items-center justify-between  mb-4">
            <h2 className="text-2xl font-bold">Leave Request Form </h2>
            {editingIndex >= 0 && (
              <span
                className="cursor-pointer"
                onClick={() => {
                  setEditingIndex(-1);
                  setLeaveRequest({
                    type: "",
                    start_date: "",
                    end_date: "",
                    reason: "",
                  });
                }}
              >
                <IoMdAddCircleOutline size={26} />
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type
              </label>
              <select
                value={leaveRequest.type}
                onChange={handleChange}
                name="type"
                required
                className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a leave type</option>
                {leaveTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={leaveRequest.start_date?.split("T")[0]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={leaveRequest.end_date?.split("T")[0]}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reason
              </label>
              <input
                type="text"
                name="reason"
                value={leaveRequest.reason}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              disabled={
                updateLeaveRequest.isLoading || createLeaveRequest.isLoading
              }
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
              {editingIndex >= 0
                ? updateLeaveRequest.isLoading
                  ? "Updating..."
                  : "Update Leave"
                : createLeaveRequest.isLoading
                ? "Requesting..."
                : "Request Leave"}{" "}
              {leaveRequest.start_date &&
                leaveRequest.end_date &&
                `(${getNumberOfDays(
                  leaveRequest.start_date,
                  leaveRequest.end_date
                )} ${
                  getNumberOfDays(
                    leaveRequest.start_date,
                    leaveRequest.end_date
                  ) > 1
                    ? "days"
                    : "day"
                }) `}
            </button>
          </form>
        </div>

        {/* listing all leave requests */}
        <div className="mt-5">
          <h3 className="text-xl font-semibold w-full">
            All Leave Requests{" "}
            {leaveRequests?.length > 0 && `(${leaveRequests.length})`}
          </h3>

          {isLoading ? (
            <small className="mt-2.5 block">Fetching Leave Requests...</small>
          ) : (
            <div>
              {leaveRequests.length > 0 ? (
                <>
                  <ul className="mt-4 space-y-2">
                    {leaveRequests.map((leave, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-2 border border-gray-200 rounded-md relative"
                      >
                        <div
                          className="top-1.5 right-1.5 absolute cursor-pointer"
                          onClick={() => {
                            expandIndex === index
                              ? setExpandIndex(null)
                              : setExpandIndex(index);
                          }}
                        >
                          {expandIndex === index ? (
                            <IoIosArrowDropup size={22} />
                          ) : (
                            <IoIosArrowDropdown size={22} />
                          )}
                        </div>
                        <div>
                          <div>
                            <strong className="min-w-[150px] inline-block">
                              Status:
                            </strong>
                            <span
                              className={
                                (leave.status === "Approved"
                                  ? "bg-green-600/20 border-green-600 text-green-600"
                                  : leave.status == "Rejected"
                                  ? "bg-red-500/20 border-red-500 text-red-500"
                                  : "bg-orange-500/20 border-orange-500 text-orange-500") +
                                " px-2  h-7 rounded w-[90px] text-center border"
                              }
                            >
                              {leave.status}
                            </span>
                          </div>
                          <div>
                            <strong className="min-w-[150px] inline-block">
                              Type:
                            </strong>
                            {leave.type}
                          </div>
                          <div>
                            <strong className="min-w-[150px] inline-block">
                              Start Date:
                            </strong>
                            {getFormattedDate(leave.start_date)}
                          </div>
                          <div>
                            <strong className="min-w-[150px] inline-block">
                              End Date:
                            </strong>
                            {getFormattedDate(leave.end_date)}
                          </div>

                          {expandIndex === index && (
                            <>
                              {" "}
                              <div className="line-clamp-1 hover:line-clamp-none">
                                <strong className="min-w-[150px] inline-block">
                                  Reason:
                                </strong>
                                {leave.reason}
                              </div>
                              <div>
                                <strong className="min-w-[150px] inline-block">
                                  Request Date:
                                </strong>
                                {getFormattedDate(leave.created_at)}
                              </div>
                              <div>
                                <strong className="min-w-[150px] inline-block">
                                  A/R By:
                                </strong>
                                {leave.approvedOrRejectedBy?.name || "Not yet"}
                              </div>
                              <div className="line-clamp-1 hover:line-clamp-none">
                                <strong className="min-w-[150px] inline-block">
                                  Comment:
                                </strong>
                                {leave.comment}
                              </div>
                            </>
                          )}

                          <div className="mt-1">
                            {leave.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => handleEdit(index)}
                                  className="text-blue-600 hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  disabled={deleteLeaveRequest.isLoading}
                                  onClick={() => handleDelete(leave._id)}
                                  className="ml-3 text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {leaveRequests.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <span> Export to:</span>
                      <div className="flex gap-1 w-fit justify-end">
                        <ExportToExcel
                          data={dataToExport}
                          fileName={`${
                            user.name
                          }_Leave_request_${new Date().toLocaleDateString()}`}
                        />
                        <ExportToPDF
                          data={dataToExport}
                          fileName={`${
                            user.name
                          }_Leave_request_${new Date().toLocaleDateString()}`}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <small className="mt-2.5 block">No Leave Request Found</small>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrudLeaveRequest;
