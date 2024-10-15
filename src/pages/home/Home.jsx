import React, { useContext, useEffect, useRef, useState } from "react";
import Loading from "../../components/ui/Loading";
import ProductCard from "../../components/ui/ProductCard";
import { useProducts } from "../../hooks/product/useProduct";
import { ProductContext } from "../../contexts/ProductContext";
import { useCategories } from "../../hooks/category/useCategory";
import { CartContext } from "../../contexts/CartContext";
import { assets } from "../../assets/assets";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { AuthContext } from "../../contexts/AuthContext";
import { useCreateOrder } from "../../hooks/order/useOrder";
import { notify } from "../../utils/toastify";
import { getTotalPrice, isItemExist } from "../../utils/cart";
import PaymentPopups from "./components/PaymentPopups";
import roundToNearestHundred from "../../utils/roundToNearestHundred";
import GoToTop from "@/components/ui/GoToTop";
import Header from "./components/Header";
import { useReactToPrint } from "react-to-print";
import ReceiptTemplate from "./components/ReceiptTemplate";
function Home() {
  const { user } = useContext(AuthContext);
  const { data, isLoading, isError } = useProducts();
  const { data: categories } = useCategories();
  const { state: products, dispatch } = useContext(ProductContext);
  const {
    state: cartItems,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isScanning,
  } = useContext(CartContext);

  const createOrder = useCreateOrder();
  const [category, setCategory] = useState("All");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [discountType, setDiscountType] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isOpen, setIsOpen] = useState({
    status: false,
    type: "",
  });
  const [requested, setRequested] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!scanning) {
        setScanning(true);
        setBarcode(""); // Clear barcode buffer when scanning starts
      }

      if (e.key === "Escape") {
        setScanning(false);
        setBarcode("");
      }

      // If 'Enter' key is pressed, process the barcode
      if (e.key === "Enter") {
        const item = products.find((product) => product.barcode == barcode);

        if (!item) {
          setBarcode("");
          setScanning(false);
          return notify("Barcode not found!", "error");
        }

        if (!isItemExist(cartItems, item)) {
          addItem({
            product: item, // product: product,
            quantity: 1,
          });
        } else {
          increaseQuantity(item._id);
        }
        // Reset barcode scanner state
        notify(item.name + " is added!", "success");
        setBarcode("");
        setScanning(false);
        return;
      }

      // Add the key value to the barcode buffer
      setBarcode((prev) => prev + e.key);
    };

    // Listen for key presses
    if (isScanning) {
      window.addEventListener("keypress", handleKeyPress);
    }

    // Cleanup the event listener
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [
    scanning,
    barcode,
    cartItems,
    addItem,
    increaseQuantity,
    products,
    isScanning,
  ]);

  useEffect(() => {
    if (category === "All") {
      dispatch({ type: "SET_PRODUCT", payload: data });
    }
    if (category !== "All") {
      const filteredProducts = data?.filter(
        (product) => product.category._id === category
      );
      dispatch({ type: "SET_PRODUCT", payload: filteredProducts });
    }
  }, [category, data, dispatch]);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    const filteredProducts = data?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        product.barcode.includes(searchKeyword)
    );
    dispatch({ type: "SET_PRODUCT", payload: filteredProducts });
  };

  const removeItemFromCart = (item) => {
    if (item.quantity === 1) {
      removeItem(item.product._id);
      return;
    }
    decreaseQuantity(item.product._id);
  };

  const addItemToCart = (item) => {
    increaseQuantity(item.product._id);
  };

  const validateOrder = () => {
    if (cartItems?.length === 0) {
      notify("No items in the cart!", "error");

      return;
    }
    if (!user) {
      notify("Please login in to order!", "error");
      return;
    }

    if (discountType === "percentage" && discount > 100) {
      notify("Discount can't be greater than 100%!", "error");
      return;
    }

    if (discountType === "cash" && discount > getTotalPrice(cartItems)) {
      notify("Discount can't be greater than total price!", "error");
      return;
    }

    if (discount < 0) {
      notify("Discount can't be negative!", "error");
      return;
    }

    setIsOpen({
      status: true,
      type: paymentMethod,
    });

    setRequested((prev) => !prev);

    // setShowOrderModal(true);
  };

  const handleDiscount = (e) => {
    setDiscount(e.target.value);
    if (e.target.value < 0) {
      setDiscount(0);
      notify("Discount can't be negative!", "info");
    }

    if (discountType === "cash" && e.target.value > getTotalPrice(cartItems)) {
      setDiscount(getTotalPrice(cartItems));
      notify("Discount can't be greater than total price!", "info");
    }

    if (discountType === "percentage" && e.target.value > 100) {
      setDiscount(100);
      notify("Discount can't be greater than 100%!", "info");
    }
  };

  const processOrder = async () => {
    setShowOrderModal(false);
    setIsOpen({ status: false, type: "" });
    const products = cartItems.map((item) => {
      return {
        product: item.product._id,
        quantity: item.quantity,
      };
    });

    const discountInCash =
      discountType === "cash"
        ? discount
        : getTotalPrice(cartItems) * (discount / 100);

    const result = await createOrder.mutateAsync({
      user: user,
      products: products,
      total_price: getTotalPrice(cartItems).toFixed(2) - discountInCash,
      transaction_date: new Date(),
      payment_method: paymentMethod,
      discount: discountInCash,
      status: "completed",
    });

    console.log("result:", result);

    if (result.status === "success") {
      notify("Order placed successfully!");
      handlePrint();
      localStorage.removeItem("cartItems");
      clearCart();
    } else {
      console.log("Order fail!:", result);
      return notify("Order fail!", "error");
    }
  };

  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: "Receipt", // Optional: Set the title for the printed document
  });

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      {/* header */}
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* body */}
      <div className="flex flex-col md:flex-row">
        {/* Main Section */}
        <div className="w-full md:w-3/4 p-4">
          {/* search bar */}
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded mb-4 w-full"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyUp={handleSearch}
          />

          {/* cagegory listing */}
          <section>
            <div className="flex gap-3 hide-scrollbar overflow-auto">
              <div onClick={() => setCategory("All")}>
                <div
                  className={`text-center mt-2 cursor-pointer bg-gray-200 py-2 px-4 rounded  ${
                    category === "All" && "text-orange-500  font-semibold"
                  }`}
                >
                  All
                </div>
              </div>
              {categories?.map((item, index) => (
                <div key={index} onClick={() => setCategory(item._id)}>
                  <div
                    className={`text-center mt-2 cursor-pointer bg-gray-200 py-2 px-4 rounded truncate ${
                      category === item._id && "text-orange-500  font-semibold "
                    }`}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* product listing */}
          <section>
            {isLoading ? (
              <Loading />
            ) : (
              <div>
                {products?.length === 0 ? (
                  <div className="mt-24 text-xl font-bold text-center text-orange-500">
                    No products found
                  </div>
                ) : (
                  <div className="grid auto-rows-auto grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-7">
                    {products?.map((product) => (
                      <React.Fragment key={product._id}>
                        <ProductCard product={product} />
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Selected Products Section */}
        <div className="w-full md:w-1/4 p-4 pt-0 border-l border-gray-300 md:fixed right-0 top-[80px] h-screen">
          <section
            className="overflow-x-auto hide-scrollbar md:max-h-[calc(100vh-370px)]"
            // style={{ maxHeight: "calc(100vh - 370px)" }}
          >
            <table className="w-full min-w-[300px]">
              <thead>
                <tr className="border-b border-gray-300 text-gray-600 sticky top-0 bg-white">
                  {/* <th className="text-start pr-6 py-4">Items</th> */}
                  <th className="text-start pr-6 py-4">Title</th>
                  <th className="text-start pr-6 py-4">Price</th>
                  <th className="text-start pr-6 py-4">Qty</th>
                  <th className="text-start pr-6 py-4">Total</th>
                  <th className="text-start pr-6 py-4  max-w-[10px] text-red-500 ">
                    <div
                      className="cursor-pointer hover:bg-red-500 hover:text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => {
                        if (cartItems.length === 0) return;
                        setShowClearCartModal(true);
                      }}
                    >
                      X
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems?.length === 0 && (
                  <tr className="border-b border-gray-300">
                    <td colSpan="6" className="text-center py-16">
                      <p className="text-gray-600">Your cart is empty</p>
                    </td>
                  </tr>
                )}
                {cartItems?.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index !== cartItems.length - 1 && "border-b"
                    } border-gray-300`}
                  >
                    {/* <td className=" py-4">
                    <img width={50} src={item.product.image} alt="" />
                  </td> */}
                    <td className="pr-3 py-3">{item.product.name}</td>
                    <td className="pr-3">${item.product.price}</td>
                    <td className="pr-3">
                      {" "}
                      <div className="flex items-center gap-1">
                        <img
                          onClick={() => removeItemFromCart(item)}
                          className="w-5 h-5 cursor-pointer"
                          src={assets.remove_icon_red}
                          alt="remove_icon_red"
                        />
                        {item.quantity}
                        <img
                          onClick={() => addItemToCart(item)}
                          className="w-5 h-5 cursor-pointer"
                          src={assets.add_icon_green}
                          alt="add_icon_green"
                        />
                      </div>
                    </td>
                    <td className="pr-3">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td
                      className="cursor-pointer"
                      onClick={() => {
                        removeItem(item.product._id);
                        // setRerender(!rerender);
                      }}
                    >
                      <img
                        className="w-3 h-3 mx-auto"
                        src={assets.cross_icon}
                        alt="remove_icon_red"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <div
            className={`shadow w-full ${cartItems.length > 0 && "h-1"}`}
          ></div>

          <section className="mt-6">
            {/* <h3 className="text-2xl font-semibold">Cart Total</h3> */}
            <table className="w-full mt-3">
              <tbody>
                <tr className="border-b">
                  <td className="font-semibold pb-3 text-gray-600">Subtotal</td>
                  <td className="text-end">
                    {getTotalPrice(cartItems).toFixed(2)} $
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-600">
                    <select
                      className="outline-none cursor-pointer -ml-1 w-[120px]"
                      name="discountType"
                      onChange={(e) => {
                        setDiscount(0);
                        setDiscountType(e.target.value);
                      }}
                    >
                      <option value="cash">Discount ($)</option>
                      <option value="percentage">Discount (%)</option>
                    </select>
                  </td>

                  <td className="text-end py-1.5">
                    <input
                      min={0}
                      max={
                        discountType === "cash" ? getTotalPrice(cartItems) : 100
                      }
                      type="number"
                      className="w-[100px] text-end outline-none"
                      value={discount}
                      onChange={handleDiscount}
                    />{" "}
                    {discountType === "cash" ? "$" : "%"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-semibold text-gray-600 py-1.5">
                    <select
                      className="outline-none cursor-pointer -ml-1 w-[120px]"
                      name="paymentMethod"
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                      }}
                    >
                      <option value="cash">Cash</option>
                      <option value="abapay">Abapay</option>
                      <option value="credit_card">Credit Card</option>
                    </select>
                  </td>
                  <td className="text-end py-1.5"></td>
                </tr>
                <tr>
                  <td className="font-bold py-1.5 text-lg">Total</td>
                  <td className="text-end font-bold text-lg">
                    {discountType === "cash"
                      ? (getTotalPrice(cartItems) - discount).toFixed(2)
                      : (
                          getTotalPrice(cartItems) -
                          getTotalPrice(cartItems) * (discount / 100)
                        ).toFixed(2)}{" "}
                    $
                  </td>
                </tr>
                <tr>
                  <td className="font-bold pb-3"></td>
                  <td className="text-end font-bold text-lg">
                    {discountType === "cash"
                      ? roundToNearestHundred(
                          (getTotalPrice(cartItems) - discount).toFixed(2) *
                            4100
                        )
                      : roundToNearestHundred(
                          (
                            getTotalPrice(cartItems) -
                            getTotalPrice(cartItems) * (discount / 100)
                          ).toFixed(2) * 4100
                        )}{" "}
                    ៛
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="flex gap-3">
                    <button
                      className="bg-orange-500  py-2 px-4 rounded text-white inline-block cursor-pointer"
                      onClick={() => {
                        if (user.role === "inventoryStaff") {
                          notify("You are not allowed to checkout", "error");
                          return;
                        }
                        validateOrder();
                      }}
                    >
                      Checkout
                    </button>
                    {cartItems.length > 0 && (
                      <button
                        onClick={handlePrint}
                        className=" bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
                      >
                        <span className="2xl:inline-block hidden">Print</span>{" "}
                        Receipt
                      </button>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </section>
        </div>
      </div>

      <PaymentPopups
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        discount={discount}
        discountType={discountType}
        paymentMethod={paymentMethod}
        processOrder={setShowOrderModal}
        isSubmitting={createOrder.isLoading}
        totalPrice={getTotalPrice(cartItems)}
        totalPriceAfterDiscount={
          discountType === "cash"
            ? (getTotalPrice(cartItems) - discount).toFixed(2)
            : (
                getTotalPrice(cartItems) -
                getTotalPrice(cartItems) * (discount / 100)
              ).toFixed(2)
        }
        requested={requested}
      />

      <ConfirmModal
        show={showOrderModal}
        setShow={setShowOrderModal}
        title="Conform Order"
        message="Are you sure you want to order?"
        onConfirm={processOrder}
      />

      <ConfirmModal
        show={showClearCartModal}
        setShow={setShowClearCartModal}
        title="Clear Cart"
        message="Are you sure you want to clear the cart?"
        onConfirm={() => {
          clearCart();
          localStorage.removeItem("cartItems");
          setShowClearCartModal(false);
        }}
      />

      <div className="hidden">
        <ReceiptTemplate
          ref={receiptRef}
          discountInCash={
            discountType === "cash"
              ? discount
              : (getTotalPrice(cartItems) * (discount / 100)).toFixed(2)
          }
          discountInPercentage={
            discountType === "percentage"
              ? discount
              : ((discount / getTotalPrice(cartItems)) * 100).toFixed(2)
          }
          total={getTotalPrice(cartItems)}
          totalAfterDiscount={
            discountType === "cash"
              ? (getTotalPrice(cartItems) - discount).toFixed(2)
              : (
                  getTotalPrice(cartItems) -
                  getTotalPrice(cartItems) * (discount / 100)
                ).toFixed(2)
          }
        />
      </div>

      <GoToTop />
    </div>
  );
}

export default Home;
