import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getFormattedDate } from "../../../utils/getFormattedDate";
export const renderRows = (item, index, handleDelete) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.product?.name}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.adjusted_by?.name}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.adjustment_type}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.quantity_adjusted}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.reason}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {getFormattedDate(item.adjustment_date)}
        </td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <Link
              to={`/updateInventory/${item._id}`}
              state={{
                inventory: item,
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
