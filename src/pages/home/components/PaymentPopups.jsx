import { useEffect, useState } from "react";
import { assets } from "../../../assets/assets";
import PropTypes from "prop-types";
import axios from "axios";
import { notify } from "../../../utils/toastify";
import roundToNearestHundred from "../../../utils/roundToNearestHundred";

const PaymentPopups = ({
  isSubmitting,
  setIsOpen,
  isOpen,
  discount,
  discountType,
  totalPriceAfterDiscount,
  processOrder,
  requested,
}) => {
  const [currency, setCurrency] = useState("cash");
  const [change, setChange] = useState(0);
  const [customerCash, setCustomerCash] = useState(0);
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    setHasRequested(false);
  }, [requested]);

  useEffect(() => {
    setCustomerCash(0);
    setChange(0);
  }, [isOpen]);

  //   calculate change
  useEffect(() => {
    if (customerCash > 0) {
      if (currency === "dollar") {
        setChange((customerCash - totalPriceAfterDiscount).toFixed(2));
      } else {
        setChange((customerCash / 4100 - totalPriceAfterDiscount).toFixed(2));
      }
    } else {
      setChange(0);
    }
  }, [customerCash, totalPriceAfterDiscount, currency, isOpen]);

  useEffect(() => {
    const handleAbapay = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/aba-payway/checkout",
          {
            total_price: totalPriceAfterDiscount,
            payment_option: isOpen.type === "abapay" ? "abapay" : "cards",
            currency: "USD",
            shipping: "0",
          }
        );

        if (response.status == 200) {
          // Create a div for the modal and overlay
          const modal = document.createElement("div");
          modal.classList.add(
            "fixed",
            "inset-0",
            "z-50",
            "flex",
            "items-center",
            "justify-center",
            "bg-black",
            "bg-opacity-50"
          );

          // Create the iframe container
          const iframeContainer = document.createElement("div");
          iframeContainer.classList.add(
            "relative",
            "w-full",
            "max-w-md",
            "bg-white",
            "rounded-lg",
            "overflow-hidden",
            "shadow-lg"
          );

          // Create the iframe element
          const iframe = document.createElement("iframe");
          iframe.classList.add(
            "w-full",
            isOpen.type == "abapay" ? "h-[410px]" : "h-[470px]"
          ); // Width and height can be adjusted based on content

          // Append iframe to the container
          iframeContainer.appendChild(iframe);

          // Append the container to the modal
          modal.appendChild(iframeContainer);

          // Append the modal to the body
          document.body.appendChild(modal);

          // Get the iframe's document
          const iframeDoc = iframe.contentWindow.document;

          // set data to localStorage to display in customer screen
          handleSetSessionStorage(false, response);

          // Inject the form HTML content from the API response into the iframe
          iframeDoc.open();
          iframeDoc.write(response.data); // Write the HTML form content into the iframe
          iframeDoc.close();
          // Optional: Close button to remove the modal
          const closeButton = document.createElement("button");
          closeButton.textContent = "Close";
          closeButton.classList.add(
            "absolute",
            "text-sm",
            "top-2",
            "right-2",
            "text-gray-500",
            "hover:text-gray-800",
            "bg-gray-200",
            "rounded-full",
            "px-2",
            "py-1"
          );
          closeButton.onclick = () => {
            modal.remove(); // Remove the modal when clicking close
            processOrder(true); // show modal to confirm the order
            handleSetSessionStorage(true);
          };

          iframeContainer.appendChild(closeButton);
        } else {
          console.log("Error creating payment");
          notify("Error creating payment", "error");
        }
      } catch (error) {
        console.error("Error creating payment:", error);
        notify("Error creating payment", "error");
      }
    };

    const handlePayWithCash = async () => {
      // set data to localStorage to display in customer screen
      handleSetSessionStorage(false);
    };

    const handleSetSessionStorage = (isClosed, responseData) => {
      localStorage.setItem(
        "paymentData",
        JSON.stringify({
          total_price: totalPriceAfterDiscount,
          discount: discount,
          discountType: discountType,
          payment_option: isOpen.type,
          currency: "USD",
          shipping: "0",
          responseData: responseData,
          isClosed: isClosed,
        })
      );
    };

    if (
      isOpen.status &&
      (isOpen.type === "abapay" || isOpen.type === "credit_card") &&
      !hasRequested
    ) {
      handleAbapay();
      setHasRequested(true);
    }

    if (isOpen.status && isOpen.type === "cash") {
      handlePayWithCash();
    }
  }, [
    isOpen,
    totalPriceAfterDiscount,
    hasRequested,
    requested,
    processOrder,
    discount,
    discountType,
  ]);

  const handleSetSessionStorage = (isClosed) => {
    localStorage.setItem(
      "paymentData",
      JSON.stringify({
        total_price: totalPriceAfterDiscount,
        discount: discount,
        discountType: discountType,
        payment_option: isOpen.type,
        currency: "USD",
        shipping: "0",
        responseData: null,
        isClosed: isClosed,
      })
    );
  };

  if (
    (isOpen.status && isOpen.type === "abapay") ||
    isOpen.type === "credit_card"
  ) {
    return <></>;
  }

  return (
    <>
      {isOpen.status && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
          {/* cash */}
          {isOpen.status && isOpen.type === "cash" && (
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="top-3 right-3 absolute cursor-pointer">
                <img
                  onClick={() => {
                    setIsOpen({ status: false, type: "" });
                    handleSetSessionStorage(true);
                  }}
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              </div>
              <h2 className="text-xl font-bold text-center text-orange-500 mb-4">
                Pay with Cash
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700">Total</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled
                      value={totalPriceAfterDiscount + " $"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      disabled
                      value={
                        roundToNearestHundred(totalPriceAfterDiscount * 4100) +
                        " ៛"
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Customer Cash</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      min={0}
                      onChange={(e) => setCustomerCash(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <select
                      name="currency"
                      className="w-fit px-3 py-2 border border-gray-300 rounded-md"
                      onChange={(e) => {
                        setCurrency(e.target.value);
                      }}
                    >
                      <option value="riel">RIEL (៛)</option>
                      <option value="dollar">USD ($)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">Change</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled
                      value={change + " $"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      disabled
                      value={roundToNearestHundred(change * 4100) + " ៛"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      processOrder(true);
                      handleSetSessionStorage(true);
                    }}
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                  >
                    {isSubmitting ? "Processing..." : "Done"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

PaymentPopups.propTypes = {
  isSubmitting: PropTypes.bool,
  setIsOpen: PropTypes.func,
  isOpen: PropTypes.object,
  processOrder: PropTypes.func,
  totalPrice: PropTypes.number,
  totalPriceAfterDiscount: PropTypes.string,
  discount: PropTypes.number,
  discountType: PropTypes.string,
  requested: PropTypes.bool,
};

export default PaymentPopups;
