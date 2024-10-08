import { useState } from "react";
import RedStar from "../../../components/ui/RedStar";
import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
const SupplierForm = ({ onSubmitFn, isSubmitting, initialData = {} }) => {
  const [data, setData] = useState({
    name: initialData.name || "",
    email: initialData.contact_info?.email || "",
    phone: initialData.contact_info?.phone || "",
    chat_id: initialData.contact_info?.chat_id || "",
    street: initialData.contact_info?.address?.street || "",
    city: initialData.contact_info?.address?.city || "",
    country: initialData.contact_info?.address?.country || "",
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
      !data.email ||
      !data.phone ||
      !data.city ||
      !data.country
    ) {
      notify("Please fill all the fields!", "error");
      return;
    }
    onSubmitFn(data);
  };

  return (
    <div className="w-full flex flex-col  border border-white/50 rounded-3xl gap-3">
      {/* data title input */}

      <div className="flex flex-col gap-2 w-full">
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
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Email <RedStar />
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Phone <RedStar />
          </label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">Telegram Chat ID</label>
          <input
            type="text"
            name="chat_id"
            value={data.chat_id}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">Street</label>
          <input
            type="text"
            name="street"
            value={data.street}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            City <RedStar />
          </label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-medium text-sm">
            Country <RedStar />
          </label>
          <input
            type="text"
            name="country"
            value={data.country}
            onChange={handleOnChange}
            className="border p-2 rounded focus:outline-orange-500"
          />
        </div>
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

SupplierForm.propTypes = {
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

export default SupplierForm;
