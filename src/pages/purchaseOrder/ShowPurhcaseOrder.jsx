import { FaWindowClose } from "react-icons/fa";
import OrderDetailCard from "./components/OrderDetailCard";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useUpdatePurchaseOrder } from "../../hooks/purchaseOrder/usePurchaseOrder";
import { notify } from "../../utils/toastify";
const ShowPurhcaseOrder = () => {
  const updatePurchaseOrder = useUpdatePurchaseOrder();
  const location = useLocation();
  const { purchaseOrder } = location.state || {};

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
  return (
    <>
      <div className="  grid place-content-center text-black z-[300]">
        <div className="overflow-auto pt-0 w-fit bg-white rounded relative">
          <div className="md:w-[600px] lg:w-[700px] bg-white">
            {/* title */}
            <div className="px-6  sticky top-0 bg-white z-10">
              <div className="pb-3 pt-5 mb-4 border-b-4 border-orange-400  bg-white flex justify-between items-center gap-4 ">
                <h2 className="text-2xl font-bold text-orange-500">
                  Purchase Order Detail
                </h2>

                <div className="cursor-pointer text-orange-500">
                  <Link to="/purchaseOrder">
                    <FaWindowClose size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* order detail information */}
            <div className="p-6 pt-1">
              <OrderDetailCard
                {...purchaseOrder}
                handleStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ShowPurhcaseOrder.propTypes = {
  order: PropTypes.object,
};

export default ShowPurhcaseOrder;
