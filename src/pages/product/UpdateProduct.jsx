import { useLocation, useNavigate } from "react-router-dom";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useCategories } from "../../hooks/category/useCategory";
import { notify } from "../../utils/toastify";
import Loading from "../../components/ui/Loading";
import ProductForm from "./components/ProductForm";
import { useUpdateProduct } from "../../hooks/product/useProduct";
import { useSuppliers } from "../../hooks/supplier/useSupplier";
const UpdateProduct = () => {
  const updateProduct = useUpdateProduct();
  const location = useLocation();
  const { product } = location.state || {};
  const { data: categories, isLoading } = useCategories();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();

  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateProduct.mutateAsync({
        id: product._id,
        ...data,
      });

      navigate("/product");

      if (result.status === "success") {
        notify("Update successfully", "success");
      } else {
        notify("Update fail!", "error");
      }
      console.log("Update item:", result);
    } catch (error) {
      notify("Update fail!", "error");
      console.error("Error creating item:", error);
    }
  };

  return (
    <div className="text-gray-900  border-gray-700 rounded shadow-xl p-4">
      {/* title */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-3xl underline text-orange-500 uppercase ">
          Update Product
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      {isLoading || isLoadingSuppliers ? (
        <Loading />
      ) : (
        <ProductForm
          onSubmitFn={onSubmitFn}
          isSubmitting={updateProduct.isLoading}
          categories={categories}
          suppliers={suppliers}
          initialData={product}
        />
      )}
    </div>
  );
};

export default UpdateProduct;
