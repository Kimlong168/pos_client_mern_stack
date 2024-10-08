import { useNavigate } from "react-router-dom";
import CategoryForm from "./components/CategoryForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useCreateCategory } from "../../hooks/category/useCategory";
import { notify } from "../../utils/toastify";
const CreateCategory = () => {
  const createCategory = useCreateCategory();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await createCategory.mutateAsync(data);

      navigate("/category");

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
          Create Category
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <CategoryForm
        onSubmitFn={onSubmitFn}
        isSubmitting={createCategory.isLoading}
      />
    </div>
  );
};

export default CreateCategory;
