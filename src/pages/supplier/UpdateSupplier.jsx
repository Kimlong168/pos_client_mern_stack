import { useLocation, useNavigate } from "react-router-dom";
import SupplierForm from "./components/SupplierForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useUpdateSupplier } from "../../hooks/supplier/useSupplier";
import { notify } from "../../utils/toastify";
const UpdateSupplier = () => {
  const updateSupplier = useUpdateSupplier();

  const location = useLocation();
  const { supplier } = location.state || {};

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateSupplier.mutateAsync({
        id: supplier._id,
        ...data,
      });

      navigate("/supplier");

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
          Create Supplier
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <SupplierForm
        onSubmitFn={onSubmitFn}
        isSubmitting={UpdateSupplier.isLoading}
        initialData={supplier}
      />
    </div>
  );
};

export default UpdateSupplier;
