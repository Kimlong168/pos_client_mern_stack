import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  orders: [],
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDER":
      return {
        ...state,
        orders: action.payload,
      };
    case "DELETE_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order._id !== action.payload),
      };
    case "SEARCH_ORDER":
      return {
        ...state,
        orders: action.payload,
      };

    default:
      return state;
  }
};

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_ORDER", payload });
  };

  const removeOrder = (payload) => {
    dispatch({ type: "DELETE_ORDER", payload });
  };

  const searchOrder = (payload) => {
    const filteredOrders = state.orders.filter(
      (order) => order._id.toLowerCase() === payload.toLowerCase()
    );

    dispatch({ type: "SEARCH_ORDER", payload: filteredOrders });

    if (payload === "") {
      setItems(state.orders);
    }
  };

  return (
    <OrderContext.Provider
      value={{
        state: state.orders,
        setItems,
        removeOrder,
        searchOrder,
        dispatch,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

OrderProvider.propTypes = {
  children: PropTypes.node,
};
