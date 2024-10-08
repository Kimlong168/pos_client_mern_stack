import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  inventories: [],
};

const categoryReducer = (state, action) => {
  switch (action.type) {
    case "SET_INVENTORY":
      return {
        ...state,
        inventories: action.payload,
      };
    case "DELETE_INVENTORY":
      return {
        ...state,
        inventories: state.inventories.filter(
          (inventory) => inventory._id !== action.payload
        ),
      };
    case "SEARCH_INVENTORY":
      return {
        ...state,
        inventories: action.payload,
      };

    default:
      return state;
  }
};

export const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_INVENTORY", payload });
  };

  const removeInventory = (payload) => {
    dispatch({ type: "DELETE_INVENTORY", payload });
  };

  const searchInventory = (payload) => {
    const filteredinventories = state.inventories.filter((inventory) =>
      inventory.reason.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_INVENTORY", payload: filteredinventories });

    if (payload === "") {
      setItems(state.inventories);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        state: state.inventories,
        setItems,
        removeInventory,
        searchInventory,
        dispatch,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

InventoryProvider.propTypes = {
  children: PropTypes.node,
};
