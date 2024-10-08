import PropTypes from "prop-types";
const SelectFilter = ({ options, filterName, handleFilter, type }) => {
  return (
    <div className="flex gap-4 items-center w-full">
      <select
        className="w-full border border-gray-300 focus:border-orange-500 focus:outline-orange-500 rounded-md p-2"
        name="filter"
        onChange={(e) => {
          if (type) {
            handleFilter(e.target.value, type);
          } else {
            handleFilter(e.target.value);
          }
          sessionStorage.setItem(filterName, e.target.value);
        }}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="capitalize">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

SelectFilter.propTypes = {
  options: PropTypes.array,
  filterName: PropTypes.string,
  handleFilter: PropTypes.func,
  type: PropTypes.string,
};

export default SelectFilter;
