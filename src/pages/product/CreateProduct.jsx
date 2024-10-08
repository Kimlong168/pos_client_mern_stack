import { useNavigate } from "react-router-dom";
import ProductForm from "./components/ProductForm";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useCategories } from "../../hooks/category/useCategory";
import { notify } from "../../utils/toastify";
import Loading from "../../components/ui/Loading";
import { useCreateProduct } from "../../hooks/product/useProduct";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
const CreateProduct = () => {
  const createProduct = useCreateProduct();
  const { data: categories, isLoading } = useCategories();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await createProduct.mutateAsync(data);

      navigate("/product");

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
          Create Product
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isLoading || isLoadingSuppliers ? (
        <Loading />
      ) : (
        <ProductForm
          onSubmitFn={onSubmitFn}
          isSubmitting={createProduct.isLoading}
          categories={categories}
          suppliers={suppliers}
        />
      )}
    </div>
  );
};

export default CreateProduct;
