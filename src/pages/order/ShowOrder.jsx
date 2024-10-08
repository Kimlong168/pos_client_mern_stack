import { FaWindowClose } from "react-icons/fa";
import OrderDetailCard from "./components/OrderDetailCard";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useUpdateOrder } from "../../hooks/order/useOrder";
import { notify } from "../../utils/toastify";
const ShowOrder = () => {
  const location = useLocation();
  const { order } = location.state || {};
  const updateOrder = useUpdateOrder();

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
  return (
    <>
      <div className="  grid place-content-center text-black z-[300]">
        <div className="overflow-auto pt-0 w-fit bg-white rounded relative">
          <div className="md:w-[600px] lg:w-[700px] bg-white">
            {/* title */}
            <div className="px-6  sticky top-0 bg-white z-10">
              <div className="pb-3 pt-5 mb-4 border-b-4 border-orange-400  bg-white flex justify-between items-center gap-4 ">
                <h2 className="text-2xl font-bold text-orange-500">
                  Order Detail
                </h2>

                <div className="cursor-pointer text-orange-500">
                  <Link to="/order">
                    <FaWindowClose size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* order detail information */}
            <div className="p-6 pt-1">
              <OrderDetailCard
                {...order}
                handleStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ShowOrder.propTypes = {
  order: PropTypes.object,
};

export default ShowOrder;
