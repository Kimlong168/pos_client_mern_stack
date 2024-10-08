import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  purchaseOrders: [],
};

const purchaseOrderReducer = (state, action) => {
  switch (action.type) {
    case "SET_PURCHASE_ORDER":
      return {
        ...state,
        purchaseOrders: action.payload,
      };
    case "DELETE_PURCHASE_ORDER":
      return {
        ...state,
        purchaseOrders: state.purchaseOrders.filter(
          (purchaseOrder) => purchaseOrder._id !== action.payload
        ),
      };
    case "SEARCH_PURCHASE_ORDER":
      return {
        ...state,
        purchaseOrders: action.payload,
      };

    default:
      return state;
  }
};

export const PurchaseOrderContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(purchaseOrderReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_PURCHASE_ORDER", payload });
  };

  const removePurchaseOrder = (payload) => {
    dispatch({ type: "DELETE_PURCHASE_ORDER", payload });
  };

  const searchPurchaseOrder = (payload) => {
    const filteredPurchaseOrders = state.purchaseOrders.filter(
      (purchaseOrder) =>
        purchaseOrder._id.toLowerCase() === payload.toLowerCase() ||
        purchaseOrder.remarks.toLowerCase().includes(payload.toLowerCase()) ||
        purchaseOrder.supplier?.name
          .toLowerCase()
          .includes(payload.toLowerCase())
    );

    dispatch({
      type: "SEARCH_PURCHASE_ORDER",
      payload: filteredPurchaseOrders,
    });

    if (payload === "") {
      setItems(state.purchaseOrders);
    }
  };

  return (
    <PurchaseOrderContext.Provider
      value={{
        state: state.purchaseOrders,
        setItems,
        removePurchaseOrder,
        searchPurchaseOrder,
        dispatch,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
};

PurchaseOrderProvider.propTypes = {
  children: PropTypes.node,
};
