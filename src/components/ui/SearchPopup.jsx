import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaWindowClose, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const SearchPopup = ({ showSearchBar, setShowSearchBar }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearchBar && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchBar]);

  const handleSearch = (e) => {
    e.preventDefault();

    navigate("/search", { state: { searchKeyword } });
    setShowSearchBar(false);
    setSearchKeyword("");
  };
  return (
    <aside
      className={`${
        showSearchBar ? "flex " : "hidden "
      } w-[100%]  justify-center items-start shadow-xl fixed bg-black/80 inset-0 z-[100] md:min-h-screen  dark:border border-white/20 pt-8`}
    >
      <div
        id="searchResult"
        className="flex flex-col gap-2  p-6 w-[90%]  sm:w-[70%] text-xl  overflow-auto bg-white rounded-xl"
      >
        {/* search bar header */}
        <div className="flex justify-between items-center gap-4 text-orange-500 font-semibold ">
          <span>Search</span>
          <FaWindowClose
            className="cursor-pointer hover:text-orange-500"
            onClick={() => setShowSearchBar(false)}
          />
        </div>

        <form className="w-full sm:w-auto" onSubmit={handleSearch}>
          <div className="flex items-center gap-3 px-4 py-2 border border-orange-500 rounded-lg">
            {/* search input */}
            <input
              ref={inputRef}
              className="outline-none border-none p-1 w-full bg-transparent "
              type="text"
              placeholder="discover your favorite food"
              name="search"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
            />

            {/* search icon */}
            <div className="text-gray-400" onClick={handleSearch}>
              <FaSearch />
            </div>
          </div>
        </form>
      </div>
    </aside>
  );
};

SearchPopup.propTypes = {
  showSearchBar: PropTypes.bool,
  setShowSearchBar: PropTypes.func,
};

export default SearchPopup;
