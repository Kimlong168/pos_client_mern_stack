import { useLocation, useNavigate } from "react-router-dom";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useUpdatePurchaseOrder } from "../../hooks/purchaseOrder/usePurchaseOrder";
import { useProducts } from "../../hooks/product/useProduct";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
import Loading from "../../components/ui/Loading";
const UpdatePurchaseOrder = () => {
  const updatePurchaseOrder = useUpdatePurchaseOrder();
  const { data: products, isLoading: isProductLoading } = useProducts();
  const { data: suppliers, isLoading: isSupplierLoading } = useSuppliers();

  const location = useLocation();
  const { purchaseOrder } = location.state || {};

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updatePurchaseOrder.mutateAsync({
        id: purchaseOrder._id,
        ...data,
      });

      navigate("/purchaseOrder");

      console.log("Update updatePurchaseOrder:", result);
      if (result.status === "success") {
        notify("Update successfully", "success");
      } else {
        notify("Update fail!", "error");
      }
      console.log("Update item:", result);
    } catch (error) {
      notify("Update fail!", "error");
      console.error("Error Updating item:", error);
    }
  };

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Update Purchase Order
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isProductLoading || isSupplierLoading ? (
        <Loading />
      ) : (
        <PurchaseOrderForm
          onSubmitFn={onSubmitFn}
          isSubmitting={updatePurchaseOrder.isLoading}
          products={products}
          suppliers={suppliers}
          initialData={purchaseOrder}
        />
      )}
    </div>
  );
};

export default UpdatePurchaseOrder;
