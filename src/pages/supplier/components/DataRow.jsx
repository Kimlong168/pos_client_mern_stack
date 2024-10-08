import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

export const renderRows = (item, index, handleDelete) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.name}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.contact_info?.phone}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.contact_info?.email}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.contact_info?.chat_id || "No Chat ID"}
        </td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.contact_info?.address.street}, {item.contact_info?.address.city}
          , {item.contact_info?.address.country}
        </td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <Link
              to={`/updateSupplier/${item._id}`}
              state={{
                supplier: item,
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
