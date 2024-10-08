import { useState } from "react";

import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import RedStar from "../../../components/ui/RedStar";
const ProductForm = ({
  onSubmitFn,
  isSubmitting,
  categories,
  suppliers,
  initialData = {},
}) => {
  const [data, setData] = useState({
    name: initialData.name || "",
    image: initialData.image || "",
    price: initialData.price || "",
    category: initialData.category?._id || "",
    supplier: initialData.supplier?._id || "",
    description: initialData.description || "",
    barcode: initialData.barcode || "",
    stock_quantity: initialData.stock_quantity || 1000,
    minimum_stock: initialData.minimum_stock || 10,
  });

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: e.target.type === "file" ? files[0] : value, // Handle file input and text input
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !data.name ||
      !data.price ||
      !data.category ||
      !data.barcode ||
      !data.supplier ||
      !data.stock_quantity ||
      !data.minimum_stock ||
      (!initialData.image && !data.image)
    ) {
      notify("Please fill all the fields!", "error");
      return;
    }

    const newData = {
      name: data.name,
      barcode: data.barcode,
      category: data.category,
      image: data.image,
      supplier: data.supplier,
      price: parseFloat(data.price),
      stock_quantity: parseInt(data.stock_quantity),
      minimum_stock: parseInt(data.minimum_stock),
      description: data.description,
    };

    onSubmitFn(newData);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">
          Name <RedStar />
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        <label className="font-medium text-sm">
          Image
          <RedStar />
        </label>
        <input
          type="file"
          name="image"
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        <label className="font-medium text-sm">
          Price
          <RedStar />
        </label>
        <input
          type="number"
          value={data.price}
          min={0}
          step="0.01"
          name="price"
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        <label className="font-medium text-sm">
          Barcode <RedStar />
        </label>
        <input
          type="text"
          placeholder="Barcode has to be unique"
          name="barcode"
          value={data.barcode}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        <div className="flex gap-3">
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Category <RedStar />
            </label>
            <select
              className="border p-2 rounded focus:outline-orange-500"
              name="category"
              value={data.category}
              onChange={handleOnChange}
            >
              <option value="" className="text-gray-400">
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Supplier <RedStar />
            </label>
            <select
              className="border p-2 rounded focus:outline-orange-500"
              name="supplier"
              value={data.supplier}
              onChange={handleOnChange}
            >
              <option value="" className="text-gray-400">
                Select Supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-1">
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Stock Quantity <RedStar />
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={data.stock_quantity}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label className="font-medium text-sm">
              Minimum Stock <RedStar />
            </label>
            <input
              type="number"
              name="minimum_stock"
              value={data.minimum_stock}
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            />
          </div>
        </div>

        <label className="font-medium text-sm">Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />
      </div>

      {/*create data button */}
      <button
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-2 mt-2 rounded"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
};

ProductForm.propTypes = {
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  categories: PropTypes.array,
  suppliers: PropTypes.array,
  initialData: PropTypes.object,
};

export default ProductForm;
