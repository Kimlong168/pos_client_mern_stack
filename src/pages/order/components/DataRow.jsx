import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import getStatusColor from "../../../utils/getStatusColor";
import { getFormattedDate } from "../../../utils/getFormattedDate";
export const renderRows = (item, index, handleDelete, handleStatusChange) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item._id}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.user?.name || "Unknown"}
        </td>
        <td className="px-4 py-3 min-w-[250px]">$ {item.discount}</td>
        <td className="px-4 py-3 min-w-[250px]">$ {item.total_price}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.transaction_date)}
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.payment_method}</td>
        <td className="px-4 py-3 min-w-[250px] group">
          <div className="group-hover:hidden">
            {getStatusColor(item.status)}{" "}
          </div>
          <select
            value={item.status}
            onChange={(e) => handleStatusChange(e, item)}
            name="status"
            className="border-none outline-none bg-transparent cursor-pointer hidden group-hover:block"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>{" "}
            <option value="cancelled">Cancelled</option>
          </select>
        </td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <Link
              to={`/order/${item._id}`}
              state={{
                order: item,
              }}
            >
              <div className="grid place-content-center rounded bg-yellow-500 text-white w-7 h-7">
                <FaEye />
              </div>
            </Link>

            <div
              onClick={() => handleDelete(item._id)}
              className="grid place-content-center rounded bg-red-600 text-white w-7 h-7 cursor-pointer"
            >
              <FaTrash />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
