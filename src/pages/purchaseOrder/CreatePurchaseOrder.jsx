import { useNavigate } from "react-router-dom";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useCreatePurchaseOrder } from "../../hooks/purchaseOrder/usePurchaseOrder";
import { useProducts } from "../../hooks/product/useProduct";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
import Loading from "../../components/ui/Loading";
const CreatePurchaseOrder = () => {
  const createPurchaseOrder = useCreatePurchaseOrder();
  const { data: products, isLoading: isProductLoading } = useProducts();
  const { data: suppliers, isLoading: isSupplierLoading } = useSuppliers();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await createPurchaseOrder.mutateAsync(data);

      navigate("/purchaseOrder");

      if (result.status === "success") {
        notify("Create successfully", "success");
      } else {
        notify("Create fail!", "error");
      }
      console.log("Created item:", result);
    } catch (error) {
      notify("Create fail!", "error");
      console.error("Error creating item:", error);
    }
  };

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Create Purchase Order
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isProductLoading || isSupplierLoading ? (
        <Loading />
      ) : (
        <PurchaseOrderForm
          onSubmitFn={onSubmitFn}
          isSubmitting={createPurchaseOrder.isLoading}
          products={products}
          suppliers={suppliers}
        />
      )}
    </div>
  );
};

export default CreatePurchaseOrder;
