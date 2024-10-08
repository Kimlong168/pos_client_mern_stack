import PropTypes from "prop-types";
const TableHeader = ({ theads }) => {
  return (
    <thead>
      <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-800">
        {theads?.map((thead, index) => (
          <th key={index} className="px-4 py-3">
            {thead}
          </th>
        ))}
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  theads: PropTypes.array.isRequired,
};
export default TableHeader;
