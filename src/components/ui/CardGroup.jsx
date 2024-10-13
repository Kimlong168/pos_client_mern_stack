import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { TbCategory2, TbReport } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa6";
import { PiFactory } from "react-icons/pi";
import { MdOutlineInventory2 } from "react-icons/md";
import { BiPurchaseTag } from "react-icons/bi";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

import {
  IoCartOutline,
  IoFastFoodOutline,
  IoMailOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { FaQrcode, FaTelegramPlane } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
const CardGroup = ({ itemNumber }) => {
  return (
    <div className="pb-4 ">
      <div className="grid gap-4 grid-cols-1 mb-4">
        <Card
          title="Order"
          subtitle="Manage orders"
          href="/order"
          Icon={IoCartOutline}
          numberOfItem={itemNumber?.university}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Product"
          subtitle="Manage products"
          href="/product"
          Icon={IoFastFoodOutline}
          numberOfItem={itemNumber?.major}
        />
        <Card
          title="Category"
          subtitle="Manage categories"
          href="/category"
          Icon={TbCategory2}
          numberOfItem={itemNumber?.category}
        />
        <Card
          title="Supplier"
          subtitle="Manage suppliers"
          href="/supplier"
          Icon={PiFactory}
          numberOfItem={itemNumber?.supplier}
        />
        <Card
          title="User"
          subtitle="Manage users"
          href="/user"
          Icon={FaRegUser}
          numberOfItem={itemNumber?.user}
        />
        <Card
          title="Inventory"
          subtitle="Manage inventories"
          href="/inventory"
          Icon={MdOutlineInventory2}
          numberOfItem={itemNumber?.inventory}
        />
        <Card
          title="Purchase Order"
          subtitle="Manage purchase orders"
          href="/purchaseOrder"
          Icon={BiPurchaseTag}
          numberOfItem={itemNumber?.purchaseOrder}
        />
        <Card
          title="Mail"
          subtitle="Send mails"
          href="/mail"
          Icon={IoMailOutline}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Telegram"
          subtitle="Send message"
          href="/telegram"
          Icon={FaTelegramPlane}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Sale Report"
          subtitle="View sale reports"
          href="/report/sale"
          Icon={TbReport}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Attendance Report"
          subtitle="View attendance reports"
          href="/report/attendance"
          Icon={TbReport}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Profile"
          subtitle="Manage profile"
          href="/profile"
          Icon={IoSettingsOutline}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Qr-Code"
          subtitle="Manage qr-code"
          href="/qrcode"
          Icon={FaQrcode}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Attendance"
          subtitle="View attendance"
          href="/attendance"
          Icon={LuClipboardList}
          numberOfItem={itemNumber?.mail}
        />
        <Card
          title="Leave Request"
          subtitle="Approve or Reject leave request"
          href="/leaveRequest"
          Icon={VscGitPullRequestGoToChanges}
          numberOfItem={itemNumber?.mail}
        />
      </div>
    </div>
  );
};

const Card = ({ title, subtitle, Icon, href, numberOfItem }) => {
  return (
    <Link
      to={href}
      className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-orange-400 group-hover:rotate-12 transition-transform duration-300" />
      <div className="flex items-center gap-4 mb-2 ">
        <Icon className="text-2xl text-orange-600 group-hover:text-white transition-colors relative z-10 duration-300" />
        {numberOfItem >= 0 && (
          <span className="text-red-500 ">{numberOfItem}</span>
        )}
      </div>
      <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
        {title}
      </h3>
      <p className="text-slate-400 group-hover:text-orange-200 relative z-10 duration-300">
        {subtitle}
      </p>
    </Link>
  );
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  Icon: PropTypes.element,
  numberOfItem: PropTypes.number,
  numberOfEachOrderStatus: PropTypes.object,
};

CardGroup.propTypes = {
  itemNumber: PropTypes.object,
};

export default CardGroup;
