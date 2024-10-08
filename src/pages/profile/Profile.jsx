import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import {
  useResetPassword,
  useUpdatePassword,
  useUpdateUser,
} from "../../hooks/user/useUser";
import { notify } from "../../utils/toastify";
import OTPPopups from "../../components/ui/OTPPopups";
import { useRequestOtp, useVerifyOtp } from "../../hooks/mail/useMail";
import { assets } from "@/assets/assets";

const Profile = () => {
  const { user: userData, setUser: setUserData } = useContext(AuthContext);
  const updateUser = useUpdateUser();
  const updatePassword = useUpdatePassword();
  const resetPassword = useResetPassword();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const [otp, setOtp] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  const [isOTPOpen, setIsOTPOpen] = useState({
    status: false,
    type: "",
  });
  // const [isSubmitting, setIsSubmitting] = useState(false);

  // State for user information
  const [user, setUser] = useState({
    id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    chat_id: userData.chat_id,
    profile_picture: userData.profile_picture,
  });

  // State for managing password change
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (
      !passwords.oldPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      return notify("Please fill all the fields!", "error");
    }

    if (passwords.newPassword.length < 8) {
      return notify("Password must be at least 8 characters long", "error");
    }

    if (passwords.newPassword === passwords.confirmPassword) {
      try {
        const result = await updatePassword.mutateAsync({
          id: user.id,
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        });

        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        if (result.status === "success") {
          notify("Password updated successfully", "success");
        } else {
          notify(result.error.message, "error");
        }
      } catch (error) {
        notify("Wrong password!", "error");
      }
    } else {
      notify("Passwords do not match!", "error");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUser.mutateAsync(user);
      console.log("result update profile", result);
      if (result.status === "success") {
        notify("Update successfully", "success");
        localStorage.setItem("user", JSON.stringify(result.data));
        setUserData(result.data);
      } else {
        notify(result.error.message, "error");
      }
    } catch (error) {
      notify("Fail to update profile", "error");
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await requestOtp.mutateAsync({
        email: user.email,
        subject: "Request OTP",
      });

      if (result.status === "success") {
        notify("OTP sent successfully, Check your email!", "success");
        setIsOTPOpen({
          status: true,
          type: "verify",
        });
      } else {
        notify("OTP sent fail", "error");
      }
    } catch (error) {
      notify("OTP sent fail", "error");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyOtp.mutateAsync({
        otp: otp,
      });

      if (result.status === "success") {
        notify("OTP verified successfully", "success");
        setIsOTPOpen({
          status: true,
          type: "reset-password",
        });
      } else {
        notify("OTP verified fail", "error");
      }
    } catch (error) {
      notify("OTP verified fail", "error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwords.newPassword || !passwords.confirmPassword) {
      return notify("Please fill all the fields!", "error");
    }

    if (passwords.newPassword.length < 8) {
      return notify("Password must be at least 8 characters long", "error");
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      return notify("Passwords do not match!", "error");
    }

    try {
      const result = await resetPassword.mutateAsync({
        email: user.email,
        password: passwords.newPassword,
      });

      console.log("result reset password", result);

      setPasswords({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (result.status === "success") {
        notify("Password reset successfully", "success");
        setIsOTPOpen({ status: false, type: "" });
      } else {
        notify(result.error.message, "error");
      }
    } catch (error) {
      notify("Password reset fail", "error");
    }
  };

  return (
    <div className={`flex justify-center items-center relative`}>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

        <div>
          <img
            className="w-[100px] h-[100px] rounded-full border-2 border-orange-500 p-[1px] mx-auto"
            src={user.profile_picture || assets.default_profile}
            alt=""
          />
        </div>

        {/* User Info Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={updateUser.isLoading}
            onClick={handleUpdateProfile}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            {updateUser.isLoading ? "Updating..." : "Update Profile"}
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-bold">Change Password</h3>
            <div>
              <label className="block text-gray-700">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div
              className=" underline text-blue-500 hover:text-blue-600 cursor-pointer"
              onClick={() => setIsOTPOpen({ status: true, type: "request" })}
            >
              forget password?
            </div>
            <button
              type="submit"
              disabled={updatePassword.isLoading}
              onClick={handlePasswordUpdate}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
              {updatePassword.isLoading ? "Updating..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>

      {/* otp popups */}
      {isOTPOpen.status && (
        <OTPPopups
          email={user.email}
          isOTPOpen={isOTPOpen}
          setIsOTPOpen={setIsOTPOpen}
          handleVerifyOTP={handleVerifyOtp}
          handleRequestOTP={handleRequestOtp}
          handleResetPassword={handleResetPassword}
          otp={otp}
          setOtp={setOtp}
          isSubmitting={
            isOTPOpen.type === "request"
              ? requestOtp.isLoading
              : isOTPOpen.type === "verify"
              ? verifyOtp.isLoading
              : resetPassword.isLoading
          }
          passwords={passwords}
          setPasswords={setPasswords}
        />
      )}
    </div>
  );
};

export default Profile;
