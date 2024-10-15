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
import {
  useClearAllInventories,
  useDeleteInventory,
  useInventories,
} from "../../hooks/inventory/useInventory";
import { InventoryContext } from "../../contexts/InventoryContext";
import SelectFilter from "../../components/form/SelectFilter";
import { useUsers } from "../../hooks/user/useUser";
import { useProducts } from "../../hooks/product/useProduct";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import { getFormattedDate } from "@/utils/getFormattedDate";
const Inventory = () => {
  const { data, isLoading, isError } = useInventories();
  const { data: users, isLoading: isUserLoading } = useUsers();
  const { data: products, isLoading: isProductLoading } = useProducts();
  const deleteInventory = useDeleteInventory();
  const clearAllInventories = useClearAllInventories();

  const {
    state: inventories,
    dispatch,
    removeInventory,
    searchInventory,
  } = useContext(InventoryContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_INVENTORY", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByAdjustmentType = (adjustmentType) => {
    if (adjustmentType === "all") {
      dispatch({ type: "SET_INVENTORY", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.adjustment_type === adjustmentType
      );
      dispatch({ type: "SET_INVENTORY", payload: filteredData });
    }
  };

  const handleFilterByAdjustedBy = (user) => {
    if (user === "all") {
      dispatch({ type: "SET_INVENTORY", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.adjusted_by?._id === user
      );
      dispatch({ type: "SET_INVENTORY", payload: filteredData });
    }
  };

  const handleFilterByProduct = (product) => {
    if (product === "all") {
      dispatch({ type: "SET_INVENTORY", payload: data });
    } else {
      const filteredData = data.filter((item) => item.product?._id === product);
      dispatch({ type: "SET_INVENTORY", payload: filteredData });
    }
  };

  const handleFilterByDate = (date) => {
    if (date === "all") {
      dispatch({ type: "SET_INVENTORY", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const adjustmentDate = new Date(item.adjustment_date);
        const today = new Date();

        // Calculate relevant date ranges
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
        ); // Start from Monday

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = today; // Current date

        const startOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        ); // Last day of last month

        // Filtering based on the date parameter
        if (date === "today") {
          return adjustmentDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return adjustmentDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return adjustmentDate >= startOfWeek && adjustmentDate <= today;
        } else if (date === "last_week") {
          return (
            adjustmentDate >= startOfLastWeek && adjustmentDate < startOfWeek
          );
        } else if (date === "this_month") {
          return adjustmentDate >= startOfMonth && adjustmentDate <= endOfMonth;
        } else if (date === "last_month") {
          return (
            adjustmentDate >= startOfLastMonth &&
            adjustmentDate <= endOfLastMonth
          );
        } else if (date === "this_year") {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return adjustmentDate >= startOfYear && adjustmentDate <= today;
        } else {
          // Last 6 months
          const startOfLast6Months = new Date(today);
          startOfLast6Months.setMonth(today.getMonth() - 6);
          return (
            adjustmentDate >= startOfLast6Months && adjustmentDate <= today
          );
        }
      });

      dispatch({ type: "SET_INVENTORY", payload: filteredData });
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_INVENTORY", payload: data });
    } else {
      searchInventory(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteInventory.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeInventory(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  const handleClearAll = async () => {
    handleDeleteFunction(async () => {
      try {
        const result = await clearAllInventories.mutateAsync();

        if (result.status === "success") {
          notify("Clear all inventories successfully", "success");
          dispatch({ type: "SET_INVENTORY", payload: [] });
        } else {
          notify(result.error.message, "error");

          console.error("Error deleting item:", result.error.message);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Clear all fail!", "error");
      }
    }, "Are you sure you want to clear all inventories? Once deleted, you will not be able to recover this data!");
  };

  const dataToExport = inventories?.map((item, index) => ({
    No: index + 1,
    Product: item.product?.name,
    "Adjusted By": item.adjusted_by?.name,
    Type: item.adjustment_type,
    Qty: item.qty,
    Reason: item.reason,
    Date: getFormattedDate(item.adjustment_date),
  }));

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`Inventory (${inventories?.length || 0})`}
        link="/createInventory"
      />
      {/* search and filter */}
      <div className="flex flex-col  items-center mb-5">
        <div className="flex flex-col md:flex-row items-center gap-5 py-5 w-full">
          <SelectNumberPerPage
            setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
            numberOfRecordsPerPage={numberOfRecordsPerPage}
            maxLength={inventories?.length}
          />

          <SearchBar
            handleSearch={handleSearch}
            setSearchKeyWord={setSearchKeyWord}
            searchKeyWord={searchKeyWord}
          />
        </div>
        <div className="flex flex-row gap-3 items-center w-full">
          <div>
            <label>
              <span className="text-gray-700">Adjustment Type</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByAdjustmentType}
              filterName={"type"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "SALE",
                  label: "Sale",
                },
                {
                  value: "PURCHASE",
                  label: "Purchase",
                },
                {
                  value: "RETURN_IN",
                  label: "Return In",
                },
                {
                  value: "RETURN_OUT",
                  label: "Return Out",
                },
                {
                  value: "CORRECTION_IN",
                  label: "Correction In",
                },
                {
                  value: "CORRECTION_OUT",
                  label: "Correction Out",
                },
              ]}
            />
          </div>
          {!isUserLoading && (
            <div>
              <label>
                <span className="text-gray-700">Adjusted By</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterByAdjustedBy}
                filterName={"adjustedBy"}
                options={[
                  {
                    value: "all",
                    label: "All",
                  },
                  ...users.map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
                ]}
              />
            </div>
          )}
          {!isProductLoading && (
            <div>
              <label>
                <span className="text-gray-700">Product</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterByProduct}
                filterName={"product"}
                options={[
                  {
                    value: "all",
                    label: "All",
                  },
                  ...products.map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
                ]}
              />
            </div>
          )}
          <div>
            <label>
              <span className="text-gray-700">Date</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByDate}
              filterName={"date"}
              type={"order"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "today",
                  label: "Today",
                },
                {
                  value: "yesterday",
                  label: "Yesterday",
                },
                {
                  value: "this_week",
                  label: "This Week",
                },
                {
                  value: "last_week",
                  label: "Last Week",
                },
                {
                  value: "this_month",
                  label: "This Month",
                },
                {
                  value: "last_month",
                  label: "Last Month",
                },
              ]}
            />
          </div>
          <div>
            <label htmlFor="">Export to</label>
            <div className="flex gap-2">
              <ExportToExcel
                data={dataToExport}
                fileName={`Purchase Orders - ${new Date().toLocaleDateString()}`}
              />
              <ExportToPDF
                data={dataToExport}
                fileName={`Purchase Orders - ${new Date().toLocaleDateString()}`}
              />
            </div>
          </div>

          <div>
            <label>Clear all inventories from database</label>
            <div
              onClick={handleClearAll}
              className="w-fit cursor-pointer bg-red-500 hover:bg-red-600 p-2 rounded text-white"
            >
              Clear all Inventories Now ☢️
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "Product",
            "Adjusted By",
            "Type",
            "Qty",
            "Reason",
            "Date",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={8} />
          ) : (
            <>
              {inventories?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={8}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={inventories}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={8}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Inventory;
