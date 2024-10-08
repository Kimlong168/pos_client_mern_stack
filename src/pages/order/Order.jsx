import { useContext, useEffect, useState } from "react";
import Pagination from "../../components/table/Pagination";
import Table from "../../components/table/Table";
import TableBody from "../../components/table/TableBody";
import TableHeader from "../../components/table/TableHeader";
import LoadingInTable from "../../components/ui/LoadingInTable";
import { getFormattedDate } from "../../utils/getFormattedDate";
import {
  useDeleteOrder,
  useOrders,
  useUpdateOrder,
} from "../../hooks/order/useOrder";
import { OrderContext } from "../../contexts/OrderContext";
import { renderRows } from "./components/DataRow";
import PageTitle from "../../components/ui/PageTitle";
import SelectNumberPerPage from "../../components/form/SelectNumberPerPage";
import SearchBar from "../../components/form/SearchBar";
import SelectFilter from "../../components/form/SelectFilter";
import ExportToExcel from "@/components/table/ExportToExcel";
import { notify } from "../../utils/toastify";
import { handleDeleteFunction } from "../../utils/handleDeleteFunction";
import { useUsers } from "../../hooks/user/useUser";
import ExportToPDF from "@/components/table/ExportToPDF";

const Order = () => {
  const { data, isLoading } = useOrders();
  const { data: users, isLoading: isUserLoading } = useUsers();
  const deleteOrder = useDeleteOrder();
  const updateOrder = useUpdateOrder();
  const {
    state: orders,
    dispatch,
    searchOrder,
    removeOrder,
  } = useContext(OrderContext);

  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [numberOfRecordsPerPage, setNumberOfRecordsPerPage] = useState(
    sessionStorage.getItem("numberOfRecordsPerPage") || 5
  );

  //  order history list
  useEffect(() => {
    if (data) {
      dispatch({ type: "SET_ORDER", payload: data });
    }
  }, [data, dispatch]);

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      dispatch({ type: "SET_ORDER", payload: data });
    } else {
      const filteredData = data.filter((item) => item.status === status);
      dispatch({ type: "SET_ORDER", payload: filteredData });
    }
  };

  const handleFilterByCashier = (cashier) => {
    if (cashier === "all") {
      dispatch({ type: "SET_ORDER", payload: data });
    } else {
      const filteredData = data.filter((item) => item.user?._id === cashier);
      dispatch({ type: "SET_ORDER", payload: filteredData });
    }
  };

  const handleFilterByPaymentMethod = (paymentMethod) => {
    if (paymentMethod === "all") {
      dispatch({ type: "SET_ORDER", payload: data });
    } else {
      const filteredData = data.filter(
        (item) => item.payment_method === paymentMethod
      );
      dispatch({ type: "SET_ORDER", payload: filteredData });
    }
  };

  const handleFilterByDate = (date) => {
    if (date === "all") {
      dispatch({ type: "SET_ORDER", payload: data });
    } else {
      const filteredData = data.filter((item) => {
        const transactionDate = new Date(item.transaction_date);
        const today = new Date();

        // Calculate relevant date ranges
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(
          today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1)
        ); // Start from Monday

        const endOfWeek = today; // End on today

        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfWeek.getDate() - 7); // Last week starts

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

        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = today; // Current date

        // Calculate the start date for last 6 months
        const startOfLast6Months = new Date(today);
        startOfLast6Months.setMonth(today.getMonth() - 6);

        // Filtering based on the date parameter
        if (date === "today") {
          return transactionDate.toDateString() === today.toDateString();
        } else if (date === "yesterday") {
          return transactionDate.toDateString() === yesterday.toDateString();
        } else if (date === "this_week") {
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        } else if (date === "last_week") {
          return (
            transactionDate >= startOfLastWeek && transactionDate < startOfWeek
          );
        } else if (date === "this_month") {
          return (
            transactionDate >= startOfMonth && transactionDate <= endOfMonth
          );
        } else if (date === "last_month") {
          return (
            transactionDate >= startOfLastMonth &&
            transactionDate <= endOfLastMonth
          );
        } else if (date === "this_year") {
          return transactionDate >= startOfYear && transactionDate <= endOfYear;
        } else {
          // Last 6 months
          return (
            transactionDate >= startOfLast6Months && transactionDate <= today
          );
        }
      });

      dispatch({ type: "SET_ORDER", payload: filteredData });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyWord.trim() === "") {
      dispatch({ type: "SET_ORDER", payload: data });
    } else {
      searchOrder(searchKeyWord);
    }
  };

  // handle delete
  const handleDelete = async (id) => {
    handleDeleteFunction(async () => {
      try {
        const result = await deleteOrder.mutateAsync(id);

        if (result.status === "success") {
          notify("Delete successfully", "success");
          removeOrder(id);
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
      _id: item._id,
      status: e.target.value,
      total_price: item.total_price,
      user: item.user._id,
      discount: item.discount,
      transaction_date: item.transaction_date,
      payment_method: item.payment_method,
      products: item.products.map((product) => ({
        product: product.product._id,
        quantity: product.quantity,
      })),
    };

    try {
      const result = await updateOrder.mutateAsync(data);
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

  const dataToExport = orders.map((order, index) => {
    return {
      No: index + 1,
      ID: order._id,
      Cashier: order.user?.name,
      Discount: order.discount,
      Total: order.total_price + " $",
      Date: getFormattedDate(order.transaction_date),
      "Payment Method": order.payment_method,
      Status: order.status,
    };
  });

  return (
    <div>
      {/* page title */}
      <PageTitle title={`Orders (${orders?.length || 0})`} link="/" />

      {/* search and filter */}
      <div className="flex flex-col  items-center mb-5">
        <div className="flex flex-col md:flex-row items-center gap-5 py-5 w-full">
          <SelectNumberPerPage
            setNumberOfRecordsPerPage={setNumberOfRecordsPerPage}
            numberOfRecordsPerPage={numberOfRecordsPerPage}
            maxLength={orders?.length}
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
          {!isUserLoading && (
            <div>
              <label>
                <span className="text-gray-700">Cashier</span>
              </label>
              <SelectFilter
                handleFilter={handleFilterByCashier}
                filterName={"cashier"}
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
          <div>
            <label>
              <span className="text-gray-700">Date</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByDate}
              filterName={"date"}
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
              <span className="text-gray-700">Payment Method</span>
            </label>
            <SelectFilter
              handleFilter={handleFilterByPaymentMethod}
              filterName={"payment_method"}
              options={[
                {
                  value: "all",
                  label: "All",
                },
                {
                  value: "credit_card",
                  label: "Credit Card",
                },
                {
                  value: "cash",
                  label: "Cash",
                },
                {
                  value: "abapay",
                  label: "Abapay",
                },
              ]}
            />
          </div>
          <div>
            <label htmlFor="">Export to</label>
            <div className="flex gap-2 w-full">
              <ExportToExcel
                data={dataToExport}
                fileName={`Order - ${new Date().toLocaleDateString()}`}
              />
              <ExportToPDF
                data={dataToExport}
                fileName={`Order - ${new Date().toLocaleDateString()}`}
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
            "Cashier",
            "Discount",
            "Total Price",
            "Transaction Date",
            "Payment Method",
            "Status",
            "Action",
          ]}
        />
        <TableBody>
          {/* loading */}
          {isLoading ? (
            <LoadingInTable colSpan={9} />
          ) : (
            <>
              {orders?.length == 0 ? (
                <tr>
                  <td
                    className="py-10 dark:text-white text-orange-500 text-center"
                    colSpan={9}
                  >
                    No data
                  </td>
                </tr>
              ) : (
                <Pagination
                  data={orders}
                  deleteItemFn={handleDelete}
                  numberOfRecordsPerPage={numberOfRecordsPerPage}
                  renderRow={renderRows}
                  columns={9}
                  handleStatusChange={handleStatusChange}
                />
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Order;
