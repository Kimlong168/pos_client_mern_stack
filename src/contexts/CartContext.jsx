import { createContext, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";

const storedItems = localStorage.getItem("cartItems");
const cartItems = storedItems ? JSON.parse(storedItems) : []; // Default to empty array if null

const initialState = {
  cartItems: cartItems,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };

    case "INCREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product._id === action.payload
            ? {
                product: item.product,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product._id === action.payload
            ? {
                product: item.product,
                quantity: item.quantity - 1,
              }
            : item
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product._id === action.payload.id
            ? {
                product: item.product,
                quantity: action.payload.quantity,
              }
            : item
        ),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (item) => item.product._id !== action.payload
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isScanning, setIsScanning] = useState(
    JSON.parse(localStorage.getItem("isScanning")) || false
  );

  //   update local storage
  useEffect(() => {
    if (state.cartItems?.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [state.cartItems]);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (item) => dispatch({ type: "REMOVE_ITEM", payload: item });

  const increaseQuantity = (id) =>
    dispatch({ type: "INCREASE_QUANTITY", payload: id });

  const decreaseQuantity = (id) =>
    dispatch({ type: "DECREASE_QUANTITY", payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        state: state.cartItems,
        dispatch,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
        isScanning,
        setIsScanning,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node,
};
