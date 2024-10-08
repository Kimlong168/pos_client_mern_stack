import { useLocation, useNavigate } from "react-router-dom";
import BackToPrevBtn from "../../components/ui/BackToPrevBtn";
import { useUpdateUser } from "../../hooks/user/useUser";
import { notify } from "../../utils/toastify";
import UserForm from "./components/UserForm";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
const UpdateUser = () => {
  const updateUser = useUpdateUser();
  const location = useLocation();
  const { user: userData, setUser: setUserData } = useContext(AuthContext);
  const { user } = location.state || {};
  let navigate = useNavigate();

  const onSubmitFn = async (data) => {
    try {
      const result = await updateUser.mutateAsync({
        id: user._id,
        ...data,
      });

      navigate("/user");

      if (result.status === "success") {
        notify("Update successfully", "success");
        if (data.email == userData.email) {
          setUserData(result.data);
          localStorage.setItem("user", JSON.stringify(result.data));
        }
      } else {
        notify(result.error.message, "error");
      }
      console.log("Updated item:", result);
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
          Update User
        </span>
        <BackToPrevBtn />
      </div>
      <br />

      <UserForm
        onSubmitFn={onSubmitFn}
        isSubmitting={updateUser.isLoading}
        initialData={user}
      />
    </div>
  );
};

export default UpdateUser;
