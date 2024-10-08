import { FaSearch } from "react-icons/fa";
import PropTypes from "prop-types";
const SearchBar = ({ searchKeyWord, setSearchKeyWord, handleSearch }) => {
  return (
    <div className="flex gap-4 items-center w-full md:w-[70%] lg:w-full">
      <form onSubmit={handleSearch} className="flex gap-1 items-center w-full">
        <input
          className="w-full border border-gray-300 focus:outline-orange-500 rounded-md p-2 h-[47px]"
          type="text"
          placeholder="Search..."
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
        <button className="group bg-orange-500 hover:bg-orange-600 text-white font-semibold h-[47px] rounded px-5 flex items-center justify-center gap-2">
          <FaSearch />{" "}
          <span className="group-hover:inline-block hidden uppercase">
            Search
          </span>
        </button>
      </form>
    </div>
  );
};

SearchBar.propTypes = {
  searchKeyWord: PropTypes.string.isRequired,
  setSearchKeyWord: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchBar;
