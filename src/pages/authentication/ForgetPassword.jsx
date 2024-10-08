import OTPPopups from "../../components/ui/OTPPopups";
import { notify } from "../../utils/toastify";
import { useResetPassword } from "../../hooks/user/useUser";
import { useRequestOtp, useVerifyOtp } from "../../hooks/mail/useMail";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  const [user, setUser] = useState({
    name: "User",
    email: "",
  });
  const resetPassword = useResetPassword();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const [otp, setOtp] = useState("");

  const [isOTPOpen, setIsOTPOpen] = useState({
    status: true,
    type: "request",
  });

  // State for managing password change
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!user.email) {
      return notify("Please enter your email!", "error");
    }

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
        notify(result.error.message, "error");
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
        navigate("/login");
      } else {
        notify(result.error.message, "error");
      }
    } catch (error) {
      notify("Password reset fail", "error");
    }
  };
  return (
    <div>
      <OTPPopups
        isAuth={false}
        setUser={setUser}
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
    </div>
  );
};

export default ForgetPassword;
