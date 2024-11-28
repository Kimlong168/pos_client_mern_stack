import { RxDashboard } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import GoToTop from "../components/ui/GoToTop";
import { assets } from "../assets/assets";
import { Outlet } from "react-router-dom";
import ConfirmModal from "../components/ui/ConfirmModal";
import { notify } from "../utils/toastify";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { TbCategory2, TbLogout2, TbReport } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";
import { PiFactory } from "react-icons/pi";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import {
  IoCartOutline,
  IoFastFoodOutline,
  IoMailOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaQrcode, FaTelegramPlane } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("dashoboard");
  const [showModal, setShowModal] = useState(false);
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

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

  const ListItems = ({ tabName, icon, pathName = "/", isBar = false }) => {
    return (
      <>
        {!isBar ? (
          <>
            <li
              className={
                activeTab === tabName && pathName !== "#"
                  ? "bg-gray-900 border-l-8 border border-orange-600"
                  : ""
              }
              onClick={() => handleChangeTab(tabName)}
            >
              <Link
                to={`${pathName}`}
                className={`${
                  pathName === "#" && "cursor-not-allowed"
                } relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-gray-800 pr-6`}
              >
                <span className="inline-flex justify-center items-center ml-4">
                  {icon}
                </span>
                <span className="ml-2 text-sm tracking-wide capitalize truncate ">
                  {tabName}
                </span>
              </Link>
            </li>
          </>
        ) : (
          <li className="px-5 hidden md:block">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                ----------------------------------
              </div>
            </div>
          </li>
        )}
      </>
    );
  };

  ListItems.propTypes = {
    tabName: PropTypes.string,
    icon: PropTypes.node,
    pathName: PropTypes.string,
    isBar: PropTypes.bool,
  };

  const sideBarListItem = [
    {
      tabName: "dashboard",
      icon: <RxDashboard />,
      pathName: "/dashboard",
    },
    {
      tabName: "order",
      icon: <IoCartOutline />,
      pathName: "/order",
    },

    {
      tabName: "product",
      icon: <IoFastFoodOutline />,
      pathName: "/product",
    },
    {
      tabName: "category",
      icon: <TbCategory2 />,
      pathName: "/category",
    },
    {
      tabName: "supplier",
      icon: <PiFactory />,
      pathName: "/supplier",
    },
    {
      tabName: "user",
      icon: <FaRegUser />,
      pathName: user.role === "admin" ? "/user" : "#",
    },
    {
      tabName: "inventory",
      icon: <MdOutlineInventory2 />,
      pathName: "/inventory",
    },
    {
      tabName: "purchase order",
      icon: <BiPurchaseTag />,
      pathName: "/purchaseOrder",
    },

    {
      tabName: "Qr-Code",
      icon: <FaQrcode />,
      pathName: "/qrcode",
    },
    {
      tabName: "Attendance",
      icon: <LuClipboardList />,
      pathName: "/attendance",
    },
    {
      tabName: "Leave Reqest",
      icon: <VscGitPullRequestGoToChanges />,
      pathName: "/leaveRequest",
    },
    {
      tabName: "Mail",
      icon: <IoMailOutline />,
      pathName: "/mail",
    },
    {
      tabName: "Telegram",
      icon: <FaTelegramPlane />,
      pathName: "/telegram",
    },
    {
      tabName: "Sale Report",
      icon: <TbReport />,
      pathName: "/report/sale",
    },
    {
      tabName: "Attendance Report",
      icon: <TbReport />,
      pathName: "/report/attendance",
    },
    {
      tabName: "Profile",
      icon: <IoSettingsOutline />,
      pathName: "/profile",
    },
  ];

  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased  text-black">
        <div className="fixed w-full flex items-center justify-between h-14 bg-gray-900 text-white z-[1000] shadow-xl">
          <div className="flex items-center justify-start md:justify-center gap-5 pl-3 w-14 md:w-64 h-14  border-l-8 border-none ">
            <div>
              <Link to="/">
                <img src={assets.logo} alt="logo" />
              </Link>
            </div>
          </div>

          <div className="flex justify-end items-center gap-5 h-14  header-right w-full px-5">
            <Link
              to={user.role === "inventoryStaff" ? "/user/profile" : "/profile"}
              className="flex items-center gap-2"
            >
              <img
                className="w-[32px] h-[32px] rounded-full"
                src={user.profile_picture || assets.default_profile}
                alt=""
              />
              <span>
                User:{" "}
                <span className="text-orange-500 font-bold">
                  {user?.name} ({user?.role})
                </span>
              </span>
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-3  py-1.5 rounded text-white font-bold bg-red-500 flex items-center gap-2 justify-center"
            >
              <TbLogout2 />
            </button>
          </div>
        </div>

        <div
          className={`fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64  h-full text-white transition-all duration-300 border-none z-[900] sidebar bg-gray-800 ${
            user.role === "inventoryStaff" ? "hidden" : ""
          }`}
          id="sidebar"
        >
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-white uppercase">
                    Main
                  </div>
                </div>
              </li>

              {sideBarListItem.map((item, index) => (
                <ListItems
                  key={index}
                  tabName={item.tabName}
                  pathName={item.pathName}
                  icon={item.icon}
                  isBar={item.isBar}
                />
              ))}
            </ul>
            <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
              Copyright @tomato 2024
            </p>
          </div>
        </div>

        <div
          className={`h-full mt-14 mb-10 p-2 md:p-4 lg:p-10 pt-5 relative  ${
            user.role !== "inventoryStaff" ? "ml-14 md:ml-64" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>

      <GoToTop />

      <ConfirmModal
        show={showModal}
        setShow={setShowModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AdminLayout;
