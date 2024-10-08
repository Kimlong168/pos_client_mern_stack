import PropTypes from "prop-types";

const LoadingInTable = ({ colSpan = 10 }) => {
  return (
    <tr className="text-center">
      <td className="py-8 text-white font-bold " colSpan={colSpan}>
        <div className=" flex items-center justify-center gap-2">
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-5 h-5 border-4 border-orange-500 rounded-full animate-spin"
          ></div>
          <span className="text-bold  text-orange-500  text-lg">
            Loading...
          </span>
        </div>
      </td>
    </tr>
  );
};

LoadingInTable.propTypes = {
  colSpan: PropTypes.number.isRequired,
};

export default LoadingInTable;
