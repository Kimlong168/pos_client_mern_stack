import { useLocation, useNavigate } from "react-router-dom";
import InventoryForm from "./components/InventoryForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useUpdateInventory } from "../../hooks/inventory/useInventory";
import { useProducts } from "../../hooks/product/useProduct";
import Loading from "../../components/ui/Loading";
const UpdateInventory = () => {
  const updateInventory = useUpdateInventory();
  const { data: products, isLoading: isProductLaoding } = useProducts();

  const location = useLocation();
  const { inventory } = location.state || {};

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateInventory.mutateAsync({
        id: inventory._id,
        ...data,
      });

      navigate("/inventory");

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
          Update Inventory
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isProductLaoding ? (
        <Loading />
      ) : (
        <InventoryForm
          onSubmitFn={onSubmitFn}
          isSubmitting={updateInventory.isLoading}
          products={products}
          initialData={inventory}
        />
      )}
    </div>
  );
};

export default UpdateInventory;
