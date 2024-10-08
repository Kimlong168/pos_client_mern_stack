import { notify } from "@/utils/toastify";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";

const CustomerScreen = () => {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const [paymentData, setPaymentData] = useState(
    JSON.parse(localStorage.getItem("paymentData")) || {
      isClosed: true,
      responseData: null,
    }
  );

  useEffect(() => {
    const updateCartFromLocalStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem("cartItems"));
      setCart(updatedCart);
      setPaymentData(
        JSON.parse(localStorage.getItem("paymentData")) || {
          isClosed: true,
          responseData: null,
        }
      );
    };

    window.addEventListener("storage", updateCartFromLocalStorage);
    return () => {
      window.removeEventListener("storage", updateCartFromLocalStorage);
    };
  }, []);

  useEffect(() => {
    const handleAbapay = async () => {
      try {
        // const response = await axios.post(
        //   "http://localhost:3000/api/aba-payway/checkout",
        //   {
        //     total_price: paymentData?.total_price,
        //     payment_option: "abapay",
        //     currency: "USD",
        //     shipping: "0",
        //   }
        // );

        // const response = paymentData?.responseData;

        const response = paymentData?.responseData;
        if (response.status === 200) {
          // Get the QR code container
          const qrcode = document.getElementById("qrcode");

          // Clear any existing QR code if present
          qrcode.innerHTML = "";

          // Create the iframe container
          const iframeContainer = document.createElement("div");
          iframeContainer.classList.add(
            "w-full",
            "bg-white",
            "overflow-hidden"
          );

          // Create the iframe element
          const iframe = document.createElement("iframe");
          iframe.classList.add("w-full", "h-[405px]"); // Adjust height to fit design

          // Append iframe to the container
          iframeContainer.appendChild(iframe);
          // Append the container to the qrcode
          qrcode.appendChild(iframeContainer);

          // Get the iframe's document
          const iframeDoc = iframe.contentWindow.document;

          // Inject the form HTML content from the API response into the iframe
          iframeDoc.open();
          iframeDoc.write(response.data); // Write the HTML form content into the iframe
          iframeDoc.close();
        } else {
          console.log("Error creating payment");
          notify("Error creating payment4545", "error");
        }
      } catch (error) {
        console.error("Error creating payment:", error);
        // notify("Error creating payment54545", "error");
      }
    };

    if (paymentData && !paymentData?.isClosed && paymentData?.responseData) {
      handleAbapay();
    }
  }, [paymentData]);

  if (paymentData?.isClosed) {
    return (
      <div className="min-h-screen grid place-content-center text-center bg-white/50">
        <img className="w-[300px] mb-5 mx-auto" src={assets.logo} alt="" />
        <h1 className="text-4xl">Welcome To Tomato Mart</h1>
        <p className="text-center mt-3 text-lg">
          Thank you for shopping with us
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-300 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <img className="w-[100px] mb-5 mx-auto" src={assets.logo} alt="" />
        <h1 className="text-2xl font-bold mb-6 text-center text-orange-500 uppercase">
          Payment Screen
        </h1>

        <div className="flex gap-4">
          <div
            className={`justify-center mb-6 w-full ${
              paymentData?.payment_option === "cash" ? "hidden" : "flex"
            }`}
            id="qrcode"
          ></div>

          <div className="w-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Products</h2>
              <ul className="space-y-4">
                {cart?.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between border-b pb-2"
                  >
                    <div>
                      <p className="text-md">{item.product.name}</p>
                      <p className="text-gray-500 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-md font-semibold">
                      {item.product.price * item.quantity}$
                    </p>
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-md font-semibold mt-4 text-end">
                  Discount: {paymentData?.discount}{" "}
                  {paymentData?.discountType === "percentage" ? "%" : "$"}{" "}
                </p>
                <p className="text-md font-semibold mt-2 text-end">
                  Total: {paymentData?.total_price} $
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p
            className={`text-gray-500 ${
              paymentData?.payment_option === "cash" && "hidden"
            }`}
          >
            Scan the QR code to complete the payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerScreen;
