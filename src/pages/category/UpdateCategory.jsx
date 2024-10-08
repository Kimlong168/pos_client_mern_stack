import { useLocation, useNavigate } from "react-router-dom";
import CategoryForm from "./components/CategoryForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useUpdateCategory } from "../../hooks/category/useCategory";
import { notify } from "../../utils/toastify";
const UpdateCategory = () => {
  const updateCategory = useUpdateCategory();

  const location = useLocation();
  const { category } = location.state || {};

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateCategory.mutateAsync({
        id: category._id,
        ...data,
      });

      navigate("/category");

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
          Update Category
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <CategoryForm
        onSubmitFn={onSubmitFn}
        isSubmitting={updateCategory.isLoading}
        initialData={category}
      />
    </div>
  );
};

export default UpdateCategory;
