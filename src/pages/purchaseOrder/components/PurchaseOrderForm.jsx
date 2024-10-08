import { useState } from "react";

import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import Multiselect from "multiselect-react-dropdown";
import RedStar from "../../../components/ui/RedStar";
const PurchaseOrderForm = ({
  products,
  suppliers,
  onSubmitFn,
  isSubmitting,
  initialData = {},
}) => {
  const [data, setData] = useState({
    products: initialData.products || [],
    supplier: initialData.supplier?._id || "",
    order_date:
      initialData.order_date?.split("T")[0] ||
      new Date().toISOString().split("T")[0],
    recieve_date: initialData.recieve_date?.split("T")[0] || "",
    total_price: initialData.total_price || "",
    status: initialData.status || "pending",
    remarks: initialData.remarks || "",
  });

  const [productQuantity, setProductQuantity] = useState(
    initialData.products?.map((item) => {
      return { product: item.product?._id, quantity: item.quantity };
    }) || []
  );

  //   options to select
  const options = products?.map((product) => ({
    name: product.name,
    id: product._id,
  }));

  // initial products
  const initProducts =
    initialData.products?.map((item) => {
      return { name: item.product?.name, id: item.product?._id };
    }) || [];

  const [productSelectedValue, setProductSelectedValue] =
    useState(initProducts);

  //   handle select
  const handleOnSelect = (e) => {
    console.log("e", e);
    const selectedValue = e.map((state) => {
      return { name: state.name, id: state.id };
    });
    setProductSelectedValue(selectedValue);
    if (selectedValue.length > 0) {
      const newProductQuantity = selectedValue.map((newQuantity) => {
        const isExist = productQuantity.find(
          (quantity) => quantity.product === newQuantity.id
        );

        if (!isExist) {
          return {
            product: newQuantity.id,
            quantity: 1,
          };
        }
        return {
          product: newQuantity.id,
          quantity: isExist.quantity,
        };
      });
      setProductQuantity(newProductQuantity);
      console.log("newProductQuantity", newProductQuantity);
    } else {
      setProductQuantity([]);
    }
  };

  // handle change quantity
  const handleChangeQuantity = (e, quantity) => {
    const newProductQuantity = productQuantity.map((oldQuantity) => {
      // if product exist, override the old quantity
      if (oldQuantity.product === quantity.product) {
        return {
          product: quantity.product,
          quantity: Number(e.target.value),
        };
      }
      return oldQuantity;
    });

    // if  not exist, push a new quantity
    if (
      !newProductQuantity.find(
        (oldQuantity) => oldQuantity.product === quantity.product
      )
    ) {
      newProductQuantity.push({
        product: quantity.product,
        quantity: Number(e.target.value),
      });
    }

    setProductQuantity(newProductQuantity);
    console.log("newProductQuantity", newProductQuantity);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value, // Handle file input and text input
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !productQuantity ||
      productQuantity.length === 0 ||
      !data.supplier ||
      !data.order_date ||
      !data.recieve_date ||
      !data.total_price ||
      !data.status
    ) {
      notify("Please fill all the fields!", "error");
      return;
    }

    const newData = {
      ...data,
      products: productQuantity,
    };

    onSubmitFn(newData);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-sm">
          Products <RedStar />
        </label>
        <Multiselect
          selectedValues={productSelectedValue}
          placeholder="Select Products"
          className="rounded border"
          options={options}
          name="products"
          displayValue="name"
          showArrow={true}
          disable={initialData.products?.length > 0 ? true : false}
          onSelect={(e) => handleOnSelect(e)} // Function will trigger on select event
          onRemove={(e) => handleOnSelect(e)} // Function will trigger on remove event
        />

        {productQuantity?.length > 0 && (
          <div className="mt-2">
            <label className="font-medium text-sm">
              Quantitys <RedStar />
            </label>
            <div
              className={`gap-2 ${
                productSelectedValue?.length > 4 ? "grid grid-cols-4" : "flex"
              }`}
            >
              {productQuantity?.map((quantity, index) => (
                <div key={index} className="w-full">
                  <label className="text-xs text-gray-700">
                    {products.map((product) => {
                      if (product?._id === quantity.product) {
                        return product?.name;
                      }
                    })}
                  </label>
                  <input
                    type="number"
                    value={quantity.quantity}
                    step="any"
                    min={1}
                    className="border border-gray-700 p-2 rounded w-full outline-none"
                    onChange={(e) => handleChangeQuantity(e, quantity)}
                    // required
                  />
                </div>
              ))}
            </div>
          </div>
        )}
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

      <div className="flex gap-3">
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">
            Order Date <RedStar />
          </label>
          <input
            type="date"
            name="order_date"
            value={data.order_date}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">
            Recieve Date <RedStar />
          </label>
          <input
            type="date"
            name="recieve_date"
            value={data.recieve_date}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">
            Total Price <RedStar />
          </label>
          <input
            type="number"
            min={0}
            name="total_price"
            value={data.total_price}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">Status</label>
          <select
            className="border p-2 rounded focus:outline-orange-500"
            name="status"
            value={data.product}
            onChange={handleOnChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Remark</label>
        <textarea
          type="text"
          name="remarks"
          value={data.remarks}
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

PurchaseOrderForm.propTypes = {
  products: PropTypes.array,
  suppliers: PropTypes.array,
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

export default PurchaseOrderForm;
