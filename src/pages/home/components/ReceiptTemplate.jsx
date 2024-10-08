import { CartContext } from "@/contexts/CartContext";
import { forwardRef, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "@/contexts/AuthContext";

const ReceiptTemplate = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);
  const { state: cartItems } = useContext(CartContext);
  return (
    <div
      ref={ref}
      className="w-80 bg-white p-4 text-sm font-mono mx-auto border border-gray-300"
    >
      {/* Store Details */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">Tomato Mart</h2>
        <p>123 Market Street</p>
        <p>Date: {new Date().toLocaleDateString()}</p>
        <p>Time: {new Date().toLocaleTimeString()}</p>
        <p>Cashier: {user.name}</p>
      </div>

      {/* Items List */}
      <div className="border-t border-b py-2">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between mb-1">
            <span>{item.product.name}</span>
            <span>
              {item.quantity} x ${item.product.price}
            </span>
          </div>
        ))}

      </div>

      {/* Totals */}
      <div className="mt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${props.total}</span>
        </div>
        <div className="flex justify-between">
          <span>
            Discount (
            {props.discountInPercentage === "0.00"
              ? "0"
              : props.discountInPercentage}
            %):
          </span>
          <span>${props.discountInCash}</span>
        </div>
        <div className="flex justify-between font-bold mt-2">
          <span>Total:</span>
          <span>${props.totalAfterDiscount}</span>
        </div>
      </div>

      {/* Footer Message */}
      <div className="text-center mt-4">
        <p>Thank you for shopping!</p>
      </div>
    </div>
  );
});
ReceiptTemplate.propTypes = {
  discountInPercentage: PropTypes.number.isRequired,
  discountInCash: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  totalAfterDiscount: PropTypes.number.isRequired,
};
ReceiptTemplate.displayName = "ReceiptTemplate";
export default ReceiptTemplate;
