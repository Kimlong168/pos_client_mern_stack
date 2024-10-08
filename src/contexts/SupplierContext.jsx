import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  suplliers: [],
};

const supplierReducer = (state, action) => {
  switch (action.type) {
    case "SET_SUPPLIER":
      return {
        ...state,
        suplliers: action.payload,
      };
    case "DELETE_SUPPLIER":
      return {
        ...state,
        suplliers: state.suplliers.filter(
          (supplier) => supplier._id !== action.payload
        ),
      };
    case "SEARCH_SUPPLIER":
      return {
        ...state,
        suplliers: action.payload,
      };

    default:
      return state;
  }
};

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [state, dispatch] = useReducer(supplierReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_SUPPLIER", payload });
  };

  const removeSupplier = (payload) => {
    dispatch({ type: "DELETE_SUPPLIER", payload });
  };

  const searchSupplier = (payload) => {
    const filteredSuplliers = state.suplliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(payload.toLowerCase()) ||
        supplier.contact_info?.email
          .toLowerCase()
          .includes(payload.toLowerCase()) ||
        supplier.contact_info?.phone
          .toLowerCase()
          .includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_SUPPLIER", payload: filteredSuplliers });

    if (payload === "") {
      setItems(state.suplliers);
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        state: state.suplliers,
        setItems,
        removeSupplier,
        searchSupplier,
        dispatch,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};

SupplierProvider.propTypes = {
  children: PropTypes.node,
};
