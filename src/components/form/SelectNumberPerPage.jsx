import PropTypes from "prop-types";
const SelectNumberPerPage = ({
  numberOfRecordsPerPage,
  setNumberOfRecordsPerPage,
  maxLength,
}) => {
  return (
    <div className="flex gap-4 items-center w-full md:min-w-[80px] md:max-w-[80px]">
      <select
        className="w-full border border-gray-300 focus:border-orange-500 focus:outline-orange-500 rounded-md p-2 py-2.5"
        value={numberOfRecordsPerPage}
        name="numberOfRecordsPerPage"
        onChange={(e) => {
          if (e.target.value === "all") {
            setNumberOfRecordsPerPage(maxLength);
            return;
          }

          setNumberOfRecordsPerPage(parseInt(e.target.value));
          sessionStorage.setItem(
            "numberOfRecordsPerPage",
            parseInt(e.target.value)
          );
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
        {/* <option value="all">All</option> */}
      </select>
    </div>
  );
};

SelectNumberPerPage.propTypes = {
  numberOfRecordsPerPage: PropTypes.number.isRequired,
  setNumberOfRecordsPerPage: PropTypes.func.isRequired,
  maxLength: PropTypes.number.isRequired,
};

export default SelectNumberPerPage;
