import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  products: [],
};

const productReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        products: action.payload,
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
      };
    case "SEARCH_PRODUCT":
      return {
        ...state,
        products: action.payload,
      };

    default:
      return state;
  }
};

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_PRODUCT", payload });
  };

  const removeProduct = (payload) => {
    dispatch({ type: "DELETE_PRODUCT", payload });
  };

  const searchProduct = (payload) => {
    const filteredProducts = state.products.filter(
      (product) =>
        product.name.toLowerCase().includes(payload.toLowerCase()) ||
        product.barcode.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_PRODUCT", payload: filteredProducts });

    if (payload === "") {
      setItems(state.products);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        state: state.products,
        setItems,
        removeProduct,
        searchProduct,
        dispatch,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node,
};
