import { assets } from "@/assets/assets";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { notify } from "@/utils/toastify";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { CartContext } from "@/contexts/CartContext";

const Header = () => {
  const { user, setUser, logout } = useContext(AuthContext);
  const { isScanning, setIsScanning } = useContext(CartContext);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    const result = logout();

    if (result) {
      notify("Logout successful");
      navigate("/login");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      // Redirect them to the home page
    } else {
      notify("Logout failed", "error");
    }
  };

  // Handle the toggle change
  const handleToggleChange = (e) => {
    // prevent from clicking Enter
    e.preventDefault();
    setIsScanning((prev) => !prev);
    localStorage.setItem("isScanning", !isScanning);
  };

  return (
    <div>
      {" "}
      <header className="p-4 flex items-center justify-between bg-gray-900 ">
        <div>
          <Link to="/">
            <div className="cursor-pointer">
              <img src={assets.logo} alt="logo" />
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-5 text-orange-500">
          <div className="flex items-center ml-2">
            <button
              onClick={handleToggleChange}
              onKeyDown={(event) => event.preventDefault()}
              className={`text-white  px-2 py-3 rounded ${
                isScanning ? "hidden" : "bg-red-500"
              }`}
            >
              Scanning Mode: {isScanning ? "ON" : "OFF"}
            </button>

            <button
              onClick={handleToggleChange}
              onKeyDown={(event) => event.preventDefault()}
              className={`text-white  px-2 py-3 rounded ${
                isScanning ? "bg-green-600" : "hidden"
              }`}
            >
              Scanning Mode: {isScanning ? "ON" : "OFF"}
            </button>
          </div>
          <Link
            to={
              user.role === "cashier" || user.role === "inventoryStaff"
                ? "/user/profile"
                : "/profile"
            }
            className="flex items-center gap-2"
          >
            <div className="w-fit min-w-[35px]">
              <img
                className="w-[32px] h-[32px] rounded-full"
                src={user.profile_picture || assets.default_profile}
                alt="profile"
              />
            </div>
            <div className="w-full hidden md:block">
              <span className="text-white font-bold">User: </span>
              {user?.name}
            </div>
          </Link>
          {(user.role === "admin" || user.role === "manager") && (
            <Link to="/dashboard">
              <IoSettingsOutline size={26} />
            </Link>
          )}
          {user.role === "inventoryStaff" && (
            <Link to="/inventory">
              <IoSettingsOutline size={26} />
            </Link>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-3  py-1.5 rounded text-white font-bold bg-red-500 flex items-center gap-2 justify-center"
          >
            <TbLogout2 />
          </button>
        </div>
      </header>
      <ConfirmModal
        show={showLogoutModal}
        setShow={setShowLogoutModal}
        title="Conform Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Header;
