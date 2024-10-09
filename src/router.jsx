import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./components/authentication/PrivateRoute";
import GuestRoute from "./components/authentication/GuestRoute";
import MainLayout from "./layouts/MainLayout";

import Error404 from "./pages/Error404";
import Unauthorized from "./pages/Unauthorized";

import Login from "./pages/authentication/Login";

import Dashboard from "./pages/Dashboard";
import Order from "./pages/order";
import Product from "./pages/product";
import CreateProduct from "./pages/product/CreateProduct";
import UpdateProduct from "./pages/product/UpdateProduct";
import User from "./pages/user";
import Category from "./pages/category";
import CreateCategory from "./pages/category/CreateCategory";

import ShowOrder from "./pages/order/ShowOrder";
import UpdateCategory from "./pages/category/UpdateCategory";
import CreateUser from "./pages/user/CreateUser";
import UpdateUser from "./pages/user/UpdateUser";

import Home from "./pages/home";
import Supplier from "./pages/supplier";
import UpdateSupplier from "./pages/supplier/UpdateSupplier";
import CreateSupplier from "./pages/supplier/CreateSupplier";
import Inventory from "./pages/inventory";
import UpdateInventory from "./pages/inventory/UpdateInventory";
import CreateInventory from "./pages/inventory/CreateInventory";
import PurchaseOrder from "./pages/purchaseOrder";
import CreatePurchaseOrder from "./pages/purchaseOrder/CreatePurchaseOrder";
import UpdatePurchaseOrder from "./pages/purchaseOrder/UpdatePurchaseOrder";
import ShowPurhcaseOrder from "./pages/purchaseOrder/ShowPurhcaseOrder";
import Mail from "./pages/mail/Mail";
import Report from "./pages/report/Report";

import Profile from "./pages/profile/Profile";
import StaffProfile from "./pages/profile/StaffProfile";
import ForgetPassword from "./pages/authentication/ForgetPassword";
import CustomerScreen from "./pages/customerScreen/CustomerScreen";
import Telegram from "./pages/telegram/Telegram";

import QrCode from "./pages/qrcode";
import CreateQrCode from "./pages/qrcode/CreateQrCode";
import UpdateQrCode from "./pages/qrcode/UpdateQrCode";

import Attendance from "./pages/attendance";
import LeaveRequest from "./pages/leaveRequest";
import AdminApprovedOrRejected from "./pages/leaveRequest/AdminApprovedOrRejected";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute
        roles={["admin", "manager", "cashier", "inventoryStaff"]}
        element={Home}
      />
    ),
  },
  {
    path: "/customer",
    element: (
      <PrivateRoute
        roles={["admin", "manager", "cashier", "inventoryStaff"]}
        element={CustomerScreen}
      />
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute
        roles={["admin", "manager", "inventoryStaff"]}
        element={MainLayout}
      />
    ),
    children: [
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/createInventory",
        element: <CreateInventory />,
      },
      {
        path: "/updateInventory/:id",
        element: <UpdateInventory />,
      },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute roles={["admin", "manager"]} element={MainLayout} />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/order/:id",
        element: <ShowOrder />,
      },
      {
        path: "/product",
        element: <Product />,
      },
      {
        path: "/createProduct",
        element: <CreateProduct />,
      },
      {
        path: "/updateProduct/:id",
        element: <UpdateProduct />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/createCategory",
        element: <CreateCategory />,
      },
      {
        path: "/updateCategory/:id",
        element: <UpdateCategory />,
      },
      {
        path: "/supplier",
        element: <Supplier />,
      },
      {
        path: "/updateSupplier/:id",
        element: <UpdateSupplier />,
      },
      {
        path: "/createSupplier",
        element: <CreateSupplier />,
      },

      {
        path: "/purchaseOrder",
        element: <PurchaseOrder />,
      },
      {
        path: "/createPurchaseOrder",
        element: <CreatePurchaseOrder />,
      },
      {
        path: "/updatePurchaseOrder/:id",
        element: <UpdatePurchaseOrder />,
      },
      {
        path: "/purchaseOrder/:id",
        element: <ShowPurhcaseOrder />,
      },
      {
        path: "/mail",
        element: <Mail />,
      },
      {
        path: "/telegram",
        element: <Telegram />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/qrcode",
        element: <QrCode />,
      },
      {
        path: "/createQrcode",
        element: <CreateQrCode />,
      },
      {
        path: "/updateQrcode/:id",
        element: <UpdateQrCode />,
      },
      {
        path: "/attendance",
        element: <Attendance />,
      },
      {
        path: "/leaveRequest",
        element: <LeaveRequest />,
      },
      {
        path: "/leaveRequest/approve/:id",
        element: <AdminApprovedOrRejected />,
      },
    ],
  },
  {
    path: "/",
    element: <PrivateRoute roles={["admin"]} element={MainLayout} />,
    children: [
      {
        path: "/user",
        element: <User />,
      },

      {
        path: "/createUser",
        element: <CreateUser />,
      },

      {
        path: "/updateUser/:id",
        element: <UpdateUser />,
      },
    ],
  },

  {
    path: "/user/profile",
    element: (
      <PrivateRoute
        roles={["cashier", "inventoryStaff"]}
        element={StaffProfile}
      />
    ),
  },

  {
    path: "/login",
    element: <GuestRoute element={Login} />,
  },
  {
    path: "/forget-password",
    element: <GuestRoute element={ForgetPassword} />,
  },

  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  {
    path: "*",
    element: <Error404 />,
  },
]);

export default router;
