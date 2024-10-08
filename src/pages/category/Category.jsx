import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";

import { CategoryContext } from "../../contexts/CategoryContext";
import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";
import { notify } from "../../utils/toastify";
import { handleDeleteFunction } from "../../utils/handleDeleteFunction";
import {
  useCategories,
  useDeleteCategory,
} from "../../hooks/category/useCategory";

const Category = () => {
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();

  const {
    state: categories,
    dispatch,
    removeCategory,
    searchCategory,
  } = useContext(CategoryContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_CATEGORY", payload: data });
    }
  }, [data, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_CATEGORY", payload: data });
    } else {
      searchCategory(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteCategory.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeCategory(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Categories (${categories?.length || 0})`}
        link="/createCategory"
      />

      {/* search and filter */}
      <div className="flex flex-col md:flex-row items-center gap-5 py-5 ">
        <SelectNumberPerPage
          setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
          numberOfRecordsPerPage={numberOfRecordsPerPage}
          maxLength={categories?.length}
        />

        <SearchBar
          handleSearch={handleSearch}
          setSearchKeyWord={setSearchKeyWord}
          searchKeyWord={searchKeyWord}
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader theads={["No", "Name", "Action"]} />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={3} />
          ) : (
            <>
              {categories?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={3}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={categories}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={3}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Category;
