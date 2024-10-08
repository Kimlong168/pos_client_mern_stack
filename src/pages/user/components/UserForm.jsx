import { useState } from "react";

import { notify } from "../../../utils/toastify";
import PropTypes from "prop-types";
import RedStar from "../../../components/ui/RedStar";
const UserForm = ({ onSubmitFn, isSubmitting, initialData = {} }) => {
  const [data, setData] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    password: initialData.password || "",
    role: initialData.role || "",
    chat_id: initialData.chat_id || "",
    profile_picture: initialData.profile_picture || "",
  });

  console.log("initialData", initialData);

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: e.target.type === "file" ? files[0] : value, // Handle file input and text input
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!data.name || !data.email || !data.password || !data.role) {
      notify("Please fill all the fields!", "error");
      return;
    }
    onSubmitFn(data);
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

        <label className="font-medium text-sm">Profile Picture</label>
        <input
          type="file"
          name="profile_picture"
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        <label className="font-medium text-sm">Telegram Chat ID</label>
        <input
          type="text"
          name="chat_id"
          value={data.chat_id}
          onChange={handleOnChange}
          className="border p-2 rounded focus:outline-orange-500"
        />

        {!initialData.email && (
          <>
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
          </>
        )}

        {!initialData.password && (
          <>
            <label className="font-medium text-sm">
              Password <RedStar />
            </label>
            <input
              type="text"
              value={data.password}
              name="password"
              onChange={handleOnChange}
              className="border p-2 rounded focus:outline-orange-500"
            />
          </>
        )}
        <label className="font-medium text-sm">
          Role <RedStar />
        </label>
        <select
          className="border p-2 rounded focus:outline-orange-500"
          name="role"
          value={data.role}
          onChange={handleOnChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
          <option value="inventoryStaff">Inventory Staff</option>
        </select>
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

UserForm.propTypes = {
  onSubmitFn: PropTypes.func,
  isSubmitting: PropTypes.bool,
  initialData: PropTypes.object,
};

export default UserForm;
