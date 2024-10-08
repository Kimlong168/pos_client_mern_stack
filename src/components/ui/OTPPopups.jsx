import PropTypes from "prop-types";
import { assets } from "../../assets/assets";
import { useEffect, useState } from "react";
import { notify } from "../../utils/toastify";
import { Link } from "react-router-dom";
const OTPPopups = ({
  isAuth = true,
  setUser,
  email,
  otp,
  setOtp,
  handleRequestOTP,
  handleVerifyOTP,
  handleResetPassword,
  isOTPOpen,
  setIsOTPOpen,
  isSubmitting,
  passwords,
  setPasswords,
}) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (isOTPOpen.status && isOTPOpen.type === "verify") {
      setTimeout(() => {
        setIsExpired(true);
      }, 60 * 1.5 * 1000); // 1.5 minutes
    }
  }, [isOTPOpen]);

  return (
    <div className="fixed inset-0  bg-black/70 z-[1000] flex justify-center items-center">
      {/* Request OTP Popup */}
      {isOTPOpen.status && isOTPOpen.type === "request" && (
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="top-3 right-3 absolute cursor-pointer">
            {isAuth ? (
              <img
                onClick={() => setIsOTPOpen({ status: false, type: "" })}
                src={assets.cross_icon}
                alt="cross_icon"
              />
            ) : (
              <Link to="/login">
                <img src={assets.cross_icon} alt="cross_icon" />
              </Link>
            )}
          </div>
          <h2 className="text-xl font-bold text-center text-orange-500 mb-4">
            Request OTP to Reset Password
          </h2>
          <form
            onSubmit={(e) => {
              handleRequestOTP(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                disabled={isAuth}
                onChange={(e) => {
                  if (!isAuth) {
                    setUser((prev) => ({ ...prev, email: e.target.value }));
                  }
                }}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            >
              {isSubmitting ? "Sending OTP..." : "Request OTP"}
            </button>
          </form>
        </div>
      )}

      {/* Verify OTP Popup */}
      {isOTPOpen.status && isOTPOpen.type === "verify" && (
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="top-3 right-3 absolute cursor-pointer">
            {isAuth ? (
              <img
                onClick={() => setIsOTPOpen({ status: false, type: "" })}
                src={assets.cross_icon}
                alt="cross_icon"
              />
            ) : (
              <Link to="/login">
                <img src={assets.cross_icon} alt="cross_icon" />
              </Link>
            )}
          </div>
          <h2 className="text-xl font-bold text-center text-orange-500 mb-4">
            Verify OTP
          </h2>
          <form
            onSubmit={(e) => {
              handleVerifyOTP(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <small>
                <span className="text-red-500">*</span> OTP will be expired in a
                few minutes. Please check your email.
              </small>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <div>
              <button
                onClick={() => {
                  if (!isExpired) {
                    notify("OTP is already sent, Check your email!", "info");
                  } else {
                    setIsOTPOpen({ status: true, type: "request" });
                  }
                }}
                className="text-blue-500 hover:underline"
              >
                Request a new OTP
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reset password Popup */}
      {isOTPOpen.status && isOTPOpen.type === "reset-password" && (
        <div
          className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="top-3 right-3 absolute cursor-pointer">
            {isAuth ? (
              <img
                onClick={() => setIsOTPOpen({ status: false, type: "" })}
                src={assets.cross_icon}
                alt="cross_icon"
              />
            ) : (
              <Link to="/login">
                <img src={assets.cross_icon} alt="cross_icon" />
              </Link>
            )}
          </div>
          <h2 className="text-xl font-bold text-center text-orange-500 mb-4">
            Reset Password
          </h2>
          <form
            onSubmit={(e) => {
              handleResetPassword(e);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700">New password</label>
              <input
                type="text"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <label className="block text-gray-700 mt-3">
                Confirm password
              </label>
              <input
                type="text"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <small>
                <span className="text-red-500">*</span> Password must be at
                least 8 characters.
              </small>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

OTPPopups.propTypes = {
  isAuth: PropTypes.bool,
  setUser: PropTypes.func,
  email: PropTypes.string,
  otp: PropTypes.string,
  setOtp: PropTypes.func,
  handleRequestOTP: PropTypes.func,
  handleVerifyOTP: PropTypes.func,
  handleResetPassword: PropTypes.func,
  isOTPOpen: PropTypes.object,
  setIsOTPOpen: PropTypes.func,
  isSubmitting: PropTypes.bool,
  passwords: PropTypes.string,
  setPasswords: PropTypes.func,
};

export default OTPPopups;
