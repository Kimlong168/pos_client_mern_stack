import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  categories: [],
};

const categoryReducer = (state, action) => {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...state,
        categories: action.payload,
      };
    case "DELETE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category._id !== action.payload
        ),
      };
    case "SEARCH_CATEGORY":
      return {
        ...state,
        categories: action.payload,
      };

    default:
      return state;
  }
};

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_CATEGORY", payload });
  };

  const removeCategory = (payload) => {
    dispatch({ type: "DELETE_CATEGORY", payload });
  };

  const searchCategory = (payload) => {
    const filteredCategories = state.categories.filter((category) =>
      category.name.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_CATEGORY", payload: filteredCategories });

    if (payload === "") {
      setItems(state.categories);
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        state: state.categories,
        setItems,
        removeCategory,
        searchCategory,
        dispatch,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

CategoryProvider.propTypes = {
  children: PropTypes.node,
};
