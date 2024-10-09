import BackToPrevBtn from "@/components/ui/BackToPrevBtn";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Loading from "@/components/ui/Loading";
import {
  useApproveOrRejectLeaveRequest,
  useLeaveRequest,
} from "@/hooks/leaveRequest/useLeaveRequest";
import { notify } from "@/utils/toastify";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const AdminApprovedOrRejected = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useLeaveRequest(id);
  const approvedOrRejected = useApproveOrRejectLeaveRequest();
  const location = useLocation();
  const { leaveRequest: leaveRequestData } = location.state || {};
  const [leaveRequest, setLeaveRequest] = useState(leaveRequestData);
  const [status, setStatus] = useState(leaveRequest?.status);
  const [comment, setComment] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setLeaveRequest(data);
    }
  }, [data]);

  const handleApproval = async () => {
    try {
      const result = await approvedOrRejected.mutateAsync({
        id: leaveRequest._id,
        status,
        comment,
      });

      navigate("/leaveRequest");

      if (result.status === "success") {
        notify(`Leave request ${status.toLowerCase()} successfully`, "success");
      } else {
        notify("Leave request update fail!", "error");
      }
      console.log("Update item:", result);
    } catch (error) {
      notify("Update fail!", "error");
      console.error("Error creating item:", error);
    }
    navigate("/leaveRequest");
  };
  if (isError) {
    return (
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <p>Leave Request not found</p>
      </div>
    );
  }
  if (!leaveRequest || isLoading)
    return (
      <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <Loading />
      </div>
    );

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-2xl font-bold ">Leave Request Details</h2>
        <BackToPrevBtn />
      </div>

      <div className="mb-4 flex flex-col gap-3">
        <p>
          <strong>Employee:</strong> {leaveRequest.employee?.name} (
          {leaveRequest.employee?.role})
        </p>
        <p>
          <strong>Leave Type:</strong> {leaveRequest.type}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={
              (leaveRequest.status === "Approved"
                ? "bg-green-600"
                : leaveRequest.status == "Rejected"
                ? "bg-red-500"
                : "bg-orange-500") + " text-white px-2 py-1 rounded"
            }
          >
            {leaveRequest.status}
          </span>
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(leaveRequest.start_date).toDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(leaveRequest.end_date).toDateString()}
        </p>
        <p>
          <strong>Number of Days off:</strong> {leaveRequest.numberOfDays}{" "}
          {leaveRequest.numberOfDays > 1 ? "days" : "day"}
        </p>
        <p>
          <strong>Reason:</strong> {leaveRequest.reason}
        </p>

        <p>
          <strong>Approved/Rejected By:</strong>{" "}
          {leaveRequest.approvedOrRejectedBy
            ? leaveRequest.approvedOrRejectedBy?.name
            : "Not Yet"}
        </p>
        <p>
          <strong>Comment:</strong> {leaveRequest.comment || "No Comment"}
        </p>
      </div>

      <textarea
        className="w-full p-2 mb-4 border rounded"
        placeholder="Add comments (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <div className="flex gap-4">
        {leaveRequest.status !== "Approved" && (
          <button
            disabled={approvedOrRejected.isLoading}
            className="w-[160px] bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              setStatus("Approved");
              setShowConfirmModal(true);
            }}
          >
            Approve
          </button>
        )}
        {leaveRequest.status !== "Rejected" && (
          <button
            disabled={approvedOrRejected.isLoading}
            className="w-[160px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => {
              setStatus("Rejected");
              setShowConfirmModal(true);
            }}
          >
            Reject
          </button>
        )}
        {leaveRequest.status !== "Pending" && (
          <button
            disabled={approvedOrRejected.isLoading}
            className="w-[160px] bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            onClick={() => {
              setStatus("Pending");
              setShowConfirmModal(true);
            }}
          >
            Pending
          </button>
        )}
      </div>

      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        title={`Confirm ${
          status === "Approved" ? "Approve" : "Reject"
        } Leave Request`}
        message={`Are you sure you want to ${
          status === "Approved" ? "approve" : "reject"
        } this leave request?`}
        onConfirm={handleApproval}
      />
    </div>
  );
};

export default AdminApprovedOrRejected;
