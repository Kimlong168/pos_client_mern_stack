import { useNavigate } from "react-router-dom";
import InventoryForm from "./components/InventoryForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { notify } from "../../utils/toastify";
import { useCreateInventory } from "../../hooks/inventory/useInventory";
import { useProducts } from "../../hooks/product/useProduct";
import Loading from "../../components/ui/Loading";
const CreateInventory = () => {
  const createInventory = useCreateInventory();
  const { data: products, isLoading: isProductLaoding } = useProducts();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await createInventory.mutateAsync(data);

      navigate("/inventory");

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
          Create Inventory
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isProductLaoding ? (
        <Loading />
      ) : (
        <InventoryForm
          onSubmitFn={onSubmitFn}
          isSubmitting={createInventory.isLoading}
          products={products}
        />
      )}
    </div>
  );
};

export default CreateInventory;
