import PropTypes from "prop-types";
import getStatusColor from "../../../utils/getStatusColor";
import { useState } from "react";

const OrderDetailCard = ({
  _id,
  user,
  products,
  total_price,
  status,
  payment_method,
  transaction_date,
  discount,
  handleStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(status);
  return (
    <div
      className="border bg-card text-card-foreground w-full max-w-3xl min-w-[100%] mx-auto bg-white"
      data-v0-t="card"
    >
      <div className="w-full overflow-x-auto">
        <div className="p-6 pt-4 grid gap-4 ">
          <div
            className={`flex flex-col space-y-1.5 pb-0  overflow-auto`}
            id="orderHistory"
          >
            {/* header title */}

            <>
              <h3 className="text-xl md:text-2xl mt-2 font-semibold break-all">
                Order ID:
                <span className="sm:hidden">
                  <br />
                </span>{" "}
                {_id}
              </h3>
              <p className="text-sm text-muted-foreground">Order Details</p>
            </>
          </div>
          <div className="grid sm:grid-cols-2  gap-4 relative">
            <div>
              {/* status */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Status
              </label>
              <p className="mt-0.5 group">
                <div className="group-hover:hidden">
                  {getStatusColor(selectedStatus)}
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    handleStatusChange(e, {
                      _id,
                      products,
                      total_price,
                      user,
                      payment_method,
                      transaction_date,
                      discount,
                      status: e.target.value,
                    });
                  }}
                  name="status"
                  className="border-none outline-none bg-transparent cursor-pointer hidden group-hover:block"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>{" "}
                  <option value="cancelled">Cancelled</option>
                </select>
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {/* fullname */}
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm">
                Cashier
              </label>

              <p className="font-medium">{user?.name || "No Data"}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border">
              <div className="relative w-full">
                {/* invoice table */}
                <table className="w-full caption-bottom text-sm">
                  {/* table header */}
                  <thead className="[&amp;_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[80px] hidden md:table-cell">
                        Image
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 max-w-[150px]">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        <span className="hidden sm:block"> Quantity</span>
                        <span className="sm:hidden"> Qty</span>
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Price
                      </th>
                    </tr>
                  </thead>

                  {/* table body */}
                  <tbody className="[&amp;_tr:last-child]:border-0">
                    {products.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        {/* image */}
                        <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 hidden md:table-cell">
                          <img
                            src={item.product?.image}
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                            width="64"
                            height="64"
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                          />
                        </td>
                        {/* product name */}
                        <td
                          className={`p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium`}
                        >
                          {item.product?.name}
                        </td>
                        {/* quantity */}
                        <td
                          className={`p-4 align-middle [&amp;:has([role=checkbox])]:pr-0`}
                        >
                          {item.quantity}
                        </td>
                        {/* price */}
                        <td
                          className={`p-4 align-middle [&amp;:has([role=checkbox])]:pr-0`}
                        >
                          {item.product?.price} $
                        </td>
                      </tr>
                    ))}

                    {/* total price */}
                    <tr>
                      <td className="hidden md:block"></td>
                      <td
                        colSpan={2}
                        className="p-4 align-middle text-right font-bold"
                      >
                        Total
                      </td>
                      <td className="p-4 align-middle font-medium truncate">
                        {total_price} $
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderDetailCard.propTypes = {
  _id: PropTypes.id,
  user: PropTypes.object,
  products: PropTypes.array,
  total_price: PropTypes.number,
  status: PropTypes.string,
  payment_method: PropTypes.string,
  transaction_date: PropTypes.string,
  discount: PropTypes.number,
  handleStatusChange: PropTypes.func,
};

export default OrderDetailCard;
