import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { getFormattedDate } from "../../../utils/getFormattedDate";
import getStatusColor from "../../../utils/getStatusColor";

export const renderRows = (item, index, handleDelete, handleStatusChange) => {
  return (
    <>
      <tr
        key={item._id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item._id}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.supplier?.name}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.supplier?.contact_info?.email} |{" "}
          {item.supplier?.contact_info?.phone}
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.total_price}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.order_date)}
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.recieve_date)}
        </td>

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
        <td className="px-4 py-3 min-w-[250px]">{item.remarks}</td>
        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <Link
              to={`/purchaseOrder/${item._id}`}
              state={{
                purchaseOrder: item,
              }}
            >
              <div className="grid place-content-center rounded bg-yellow-500 text-white w-7 h-7">
                <FaEye />
              </div>
            </Link>

            <Link
              to={`/updatePurchaseOrder/${item._id}`}
              state={{
                purchaseOrder: item,
              }}
            >
              <div className="grid place-content-center rounded bg-green-600 text-white w-7 h-7">
                <FaEdit />
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
