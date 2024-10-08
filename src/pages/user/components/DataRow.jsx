import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import PopupImage from "../../../components/ui/PopupImage";
import { assets } from "@/assets/assets";

export const renderRows = (item, index, handleDelete) => {
  return (
    <>
      <tr
        key={item.id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">
          <PopupImage image={item.profile_picture || assets.default_profile} />
        </td>
        <td className="px-4 py-3 min-w-[250px]">{item.name}</td>
        <td className="px-4 py-3 min-w-[250px] line-clamp-2 hover:line-clamp-none">
          {item.email}
        </td>

        <td className="px-4 py-3 min-w-[250px] capitalize">{item.role}</td>
        <td className="px-4 py-3 min-w-[250px]">
          {item.chat_id || "No Chat ID"}
        </td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <Link
              to={`/updateUser/${item._id}`}
              state={{
                user: item,
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
