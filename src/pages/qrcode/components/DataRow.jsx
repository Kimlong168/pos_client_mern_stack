import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import QRCode from "react-qr-code";
import { MdCloudDownload } from "react-icons/md";
import downloadQrcode from "@/utils/downloadQrcode";

const url = import.meta.env.VITE_APP_BASE_URL + "/user/attendance?att=";

export const renderRows = (item, index, handleDelete) => {
  return (
    <>
      <tr
        key={item._id}
        className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
      >
        <td className="px-4 py-3">{index + 1}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.location}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.lat}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.lng}</td>
        <td className="px-4 py-3 min-w-[250px]">{item.radius} m</td>
        <td className="px-4 py-3 min-w-[250px]">
          <div
            id={`${item.location.replace(/\s+/g, "")}`}
            className={`p-4 w-fit flex flex-col justify-center items-center bg-white rounded-lg`}
            title={url + item._id}
          >
            <QRCode
              value={url + item._id}
              size={140}
              fgColor={"black"}
              bgColor={"white"}
            />
            <span className="font-semibold mt-1">{item.location}</span>
          </div>
        </td>

        <td className="px-4 py-3 text-sm text-center">
          <div className=" flex items-center gap-2">
            <div
              onClick={() => downloadQrcode(item)}
              className="grid place-content-center rounded bg-blue-400 text-white w-7 h-7 cursor-pointer"
            >
              <MdCloudDownload />
            </div>
            <Link
              to={`/updateQrcode/${item._id}`}
              state={{
                qrcode: item,
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
