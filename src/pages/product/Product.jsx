import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";

import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";
import { notify } from "../../utils/toastify";
import { handleDeleteFunction } from "../../utils/handleDeleteFunction";

import { useDeleteProduct, useProducts } from "../../hooks/product/useProduct";
import { ProductContext } from "../../contexts/ProductContext";
import SelectFilter from "../../components/form/SelectFilter";
import { useCategories } from "../../hooks/category/useCategory";
import { useSuppliers } from "../../hooks/supplier/useSupplier";

const Product = () => {
  const { data, isLoading, isError: isProductError } = useProducts();
  const {
    data: categories,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useCategories();
  const {
    data: suppliers,
    isLoading: isSupplierLoading,
    isError: isSupplierError,
  } = useSuppliers();
  const deleteProduct = useDeleteProduct();

  const {
    state: products,
    dispatch,
    removeProduct,
    searchProduct,
  } = useContext(ProductContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_PRODUCT", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByCategory = (category) => {
    if (category === "all") {
      dispatch({ type: "SET_PRODUCT", payload: data });
    } else {
      const filteredData = data.filter(
        (product) => product.category._id === category
      );
      dispatch({ type: "SET_PRODUCT", payload: filteredData });
    }
  };

  const handleFilterBySupplier = (supplier) => {
    if (supplier === "all") {
      dispatch({ type: "SET_PRODUCT", payload: data });
    } else {
      const filteredData = data.filter(
        (product) => product.supplier._id === supplier
      );
      dispatch({ type: "SET_PRODUCT", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_PRODUCT", payload: data });
    } else {
      searchProduct(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteProduct.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeProduct(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  if (isProductError || isCategoryError || isSupplierError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Products (${products?.length || 0})`}
        link="/createProduct"
      />

      {/* search and filter */}
      <div className="flex flex-col  items-center mb-5">
        <div className="flex flex-col md:flex-row items-center gap-5 py-5 w-full">
          <SelectNumberPerPage
            setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
            numberOfRecordsPerPage={numberOfRecordsPerPage}
            maxLength={products?.length}
          />

          <SearchBar
            handleSearch={handleSearch}
            setSearchKeyWord={setSearchKeyWord}
            searchKeyWord={searchKeyWord}
          />
        </div>
        <div className="flex flex-row gap-3 items-center w-full">
          {!isCategoryLoading && (
            <div>
              <label>
                <span className="text-gray-700">Category</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterByCategory}
                filterName={"category"}
                options={[
                  { value: "all", label: "All" },
                  ...categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  })),
                ]}
              />
            </div>
          )}
          {!isSupplierLoading && (
            <div>
              <label>
                <span className="text-gray-700">Supplier</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterBySupplier}
                filterName={"supplier"}
                options={[
                  { value: "all", label: "All" },
                  ...suppliers.map((supplier) => ({
                    value: supplier._id,
                    label: supplier.name,
                  })),
                ]}
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Name",
            "Image",
            "Price",
            "Category",
            "Supplier",
            "Barcode",
            "Stock",
            "Description",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={10} />
          ) : (
            <>
              {products?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={10}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={products}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={10}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Product;
