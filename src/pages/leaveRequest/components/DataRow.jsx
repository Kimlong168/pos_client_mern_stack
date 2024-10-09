// import { FaEdit } from "react-icons/fa";
import { getFormattedDate } from "../../../utils/getFormattedDate";
import { Link } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
export const renderRows = (item, index) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.employee?.name} ({item.employee?.role})
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.type}</td>
        <td className="px-4 py-3 min-w-[250px]">
          <div className="flex gap-2 items-center">
            <span
              className={
                (item.status === "Approved"
                  ? "bg-green-600/20 border-green-600 text-green-600"
                  : item.status == "Rejected"
                  ? "bg-red-500/20 border-red-500 text-red-500"
                  : "bg-orange-500/20 border-orange-500 text-orange-500") +
                " px-2  h-7 rounded w-[90px] text-center border"
              }
            >
              {item.status}
            </span>
            <div className=" flex items-center gap-2">
              <Link
                to={`/leaveRequest/approve/${item._id}`}
                state={{
                  leaveRequest: item,
                }}
              >
                <div className="grid place-content-center rounded bg-blue-500 text-white w-7 h-7">
                  <RxUpdate />
                </div>
              </Link>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.start_date)} -{" "}
          {getFormattedDate(item.end_date)} <br /> ({item.numberOfDays}
          {item.numberOfDays > 1 ? "days" : "day"})
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.reason}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.approvedOrRejectedBy?.name || "Not Yet"}{" "}
          {item.approvedOrRejectedBy?.role
            ? `(${item.approvedOrRejectedBy?.role})`
            : ""}
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.created_at)}
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.comment || "No Comment"}
        </td>
      </tr>
    </>
  );
};
