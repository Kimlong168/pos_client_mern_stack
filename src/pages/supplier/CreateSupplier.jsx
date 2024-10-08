import { useNavigate } from "react-router-dom";
import SupplierForm from "./components/SupplierForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useCreateSupplier } from "../../hooks/supplier/useSupplier";
import { notify } from "../../utils/toastify";
const CreateSupplier = () => {
  const createSupplier = useCreateSupplier();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await createSupplier.mutateAsync(data);

      navigate("/supplier");

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
          Create Supplier
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <SupplierForm
        onSubmitFn={onSubmitFn}
        isSubmitting={createSupplier.isLoading}
      />
    </div>
  );
};

export default CreateSupplier;
