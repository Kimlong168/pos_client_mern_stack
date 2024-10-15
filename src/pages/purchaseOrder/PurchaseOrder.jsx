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

import { PurchaseOrderContext } from "../../contexts/PurchaseOrderContext";
import {
  useDeletePurchaseOrder,
  usePurchaseOrders,
  useUpdatePurchaseOrder,
} from "../../hooks/purchaseOrder/usePurchaseOrder";
import SelectFilter from "../../components/form/SelectFilter";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
import ExportToExcel from "@/components/table/ExportToExcel";
import ExportToPDF from "@/components/table/ExportToPDF";
import { getFormattedDate } from "@/utils/getFormattedDate";
const PurchaseOrder = () => {
  const { data, isLoading, isError } = usePurchaseOrders();
  const { data: suppliers, isLoading: isSupplierLoading, isError: isSupplierError } = useSuppliers();
  const deletePurchaseOrder = useDeletePurchaseOrder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();

  const {
    state: purchaseOrders,
    dispatch,
    removePurchaseOrder,
    searchPurchaseOrder,
  } = useContext(PurchaseOrderContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_PURCHASE_ORDER", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      dispatch({ type: "SET_PURCHASE_ORDER", payload: data });
    } else {
      const filteredData = data.filter((item) => item.status === status);
      dispatch({ type: "SET_PURCHASE_ORDER", payload: filteredData });
    }
  };

  const handleFilterBySupplier = (supplier) => {
    if (supplier === "all") {
      dispatch({ type: "SET_PURCHASE_ORDER", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.supplier?._id === supplier
      );
      dispatch({ type: "SET_PURCHASE_ORDER", payload: filteredData });
    }
  };

  const handleFilterByDate = (date, type) => {
    if (date === "all") {
      dispatch({ type: "SET_PURCHASE_ORDER", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const purchaseOrderDate = new Date(
          type === "order" ? item.order_date : item.recieve_date
        );
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
          return purchaseOrderDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return purchaseOrderDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return purchaseOrderDate >= startOfWeek && purchaseOrderDate <= today;
        } else if (date === "last_week") {
          return (
            purchaseOrderDate >= startOfLastWeek &&
            purchaseOrderDate < startOfWeek
          );
        } else if (date === "this_month") {
          return (
            purchaseOrderDate >= startOfMonth && purchaseOrderDate <= endOfMonth
          );
        } else if (date === "last_month") {
          return (
            purchaseOrderDate >= startOfLastMonth &&
            purchaseOrderDate <= endOfLastMonth
          );
        } else if (date === "this_year") {
          const startOfYear = new Date(today.getFullYear(), 0, 1);
          return purchaseOrderDate >= startOfYear && purchaseOrderDate <= today;
        } else {
          // Last 6 months
          const startOfLast6Months = new Date(today);
          startOfLast6Months.setMonth(today.getMonth() - 6);
          return (
            purchaseOrderDate >= startOfLast6Months &&
            purchaseOrderDate <= today
          );
        }
      });

      dispatch({ type: "SET_PURCHASE_ORDER", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_PURCHASE_ORDER", payload: data });
    } else {
      searchPurchaseOrder(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deletePurchaseOrder.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removePurchaseOrder(id);
        } else {
          notify("Delete fail!", "error");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        notify("Delete fail!", "error");
      }
    });
  };

  const handleStatusChange = async (e, item) => {
    item.status = e.target.value;

    // reformate data
    const data = {
      id: item._id,
      supplier: item.supplier?._id,
      total_price: item.total_price,
      order_date: item.order_date,
      recieve_date: item.recieve_date,
      remarks: item.remarks,
      products: item.products.map((product) => ({
        product: product.product._id,
        quantity: product.quantity,
      })),
      status: e.target.value,
    };

    try {
      const result = await updatePurchaseOrder.mutateAsync(data);
      console.log("updating item:", result);
      if (result.status === "success") {
        notify("Update successfully", "success");
      } else {
        notify("Update fail!", "error");
      }
    } catch (error) {
      console.error("Error creating or updating item:", error);
      notify("Update fail!", "error");
    }
  };

  const dataToExport = purchaseOrders?.map((purchaseOrder, index) => ({
    No: index + 1,
    ID: purchaseOrder._id,
    Supplier: purchaseOrder.supplier?.name,
    "Total Price": purchaseOrder.total_price,
    "Order Date": getFormattedDate(purchaseOrder.order_date),
    "Recieve Date": getFormattedDate(purchaseOrder.recieve_date),
    Status: purchaseOrder.status,
    Remarks: purchaseOrder.remarks,
  }));


  if(isError || isSupplierError){
    return <div>Error...</div>
  }

  return (
    <div>
      {/* page title */}
      <PageTitle
        title={`purchase Orders (${purchaseOrders?.length || 0})`}
        link="/createPurchaseOrder"
      />

      {/* search and filter */}
      <div className="flex flex-col  items-center mb-5">
        <div className="flex flex-col md:flex-row items-center gap-5 py-5 w-full">
          <SelectNumberPerPage
            setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
            numberOfRecordsPerPage={numberOfRecordsPerPage}
            maxLength={purchaseOrders?.length}
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
              <span className="text-gray-700">Status</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByStatus}
              filterName={"status"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "pending",
                  label: "Pending",
                },
                {
                  value: "completed",
                  label: "Completed",
                },
                {
                  value: "cancelled",
                  label: "Cancelled",
                },
              ]}
            />
          </div>
          {!isSupplierLoading && (
            <div>
              <label>
                <span className="text-gray-700">Supplier</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterBySupplier}
                filterName={"supplier"}
                options={[
                  {
                    value: "all",
                    label: "All",
                  },
                  ...suppliers.map((user) => ({
                    value: user._id,
                    label: user.name,
                  })),
                ]}
              />
            </div>
          )}
          <div>
            <label>
              <span className="text-gray-700">Order Date</span>
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
            <label>
              <span className="text-gray-700">Recieve Date</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByDate}
              filterName={"date"}
              type={"recieve"}
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
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader
          theads={[
            "No",
            "ID",
            "Supplier",
            "Supplier's Contact",
            "Total Price",
            "Order Date",
            "Recieve Date",
            "Status",
            "Remarks",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={10} />
          ) : (
            <>
              {purchaseOrders?.length == 0 ? (
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
                  data={purchaseOrders}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  handleStatusChange={handleStatusChange}
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

export default PurchaseOrder;
