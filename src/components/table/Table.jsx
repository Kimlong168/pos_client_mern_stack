import PropTypes from "prop-types";
const Table = ({ children }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <table className="w-full">{children}</table>
      </div>
      <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-100 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800"></div>
    </div>
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Table;
