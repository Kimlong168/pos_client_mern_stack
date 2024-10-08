import { useContext, useState } from "react";

import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import { AuthContext } from "../../../contexts/AuthContext";
import RedStar from "../../../components/ui/RedStar";
const IventoryForm = ({
  onSubmitFn,
  isSubmitting,
  products,
  initialData = {},
}) => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    product: initialData.product?._id || "",
    adjusted_by: user._id,
    adjustment_type: initialData.adjustment_type || "",
    quantity_adjusted: initialData.quantity_adjusted || "",
    reason: initialData.reason || "",
    adjustment_date: new Date().toISOString(),
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
      !data.product ||
      !data.adjustment_type ||
      !data.quantity_adjusted ||
      !data.reason
    ) {
      notify("Please fill all the fields!", "error");
      return;
    }
    onSubmitFn(data);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="flex gap-3">
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">
            Product <RedStar />
          </label>
          <select
            className="border p-2 rounded focus:outline-orange-500"
            name="product"
            value={data.product}
            disabled={initialData.product}
            onChange={handleOnChange}
          >
            <option value="" className="text-gray-400">
              Select Product
            </option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-sm">
            Adjustment Type <RedStar />
          </label>
          <select
            className="border p-2 rounded focus:outline-orange-500"
            name="adjustment_type"
            value={data.adjustment_type}
            onChange={handleOnChange}
          >
            <option value="" className="text-gray-400">
              Select Type
            </option>
            <option value="PURCHASE">PURCHASE</option>
            <option value="SALE">SALE</option>
            <option value="RETURN_IN">RETURN IN</option>
            <option value="RETURN_OUT">RETURN OUT</option>
            <option value="DAMAGE">DAMAGE</option>
            <option value="CORRECTION_IN">CORRECTION IN</option>
            <option value="CORRECTION_OUT">CORRECTION OUT</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">
          Quantity Adjusted <RedStar />
        </label>
        <input
          type="number"
          name="quantity_adjusted"
          min={0}
          value={data.quantity_adjusted}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />
      </div>

      <label className="font-medium text-sm">
        Reason <RedStar />
      </label>
      <textarea
        name="reason"
        value={data.reason}
        onChange={handleOnChange}
        className="border p-2 rounded focus:outline-orange-500"
      />

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

IventoryForm.propTypes = {
  onSubmitFn: PropTypes.func,
  products: PropTypes.array,
  users: PropTypes.array,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

export default IventoryForm;
