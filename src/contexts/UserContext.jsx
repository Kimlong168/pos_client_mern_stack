import { createContext, useReducer } from "react";
import PropTypes from "prop-types";

const initialState = {
  users: [],
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        users: action.payload,
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    case "SEARCH_USER":
      return {
        ...state,
        users: action.payload,
      };

    default:
      return state;
  }
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setItems = (payload) => {
    dispatch({ type: "SET_USER", payload });
  };

  const removeUser = (payload) => {
    dispatch({ type: "DELETE_USER", payload });
  };

  const searchUser = (payload) => {
    const filteredUsers = state.users.filter(
      (user) =>
        user.name.toLowerCase().includes(payload.toLowerCase()) ||
        user.email.toLowerCase().includes(payload.toLowerCase()) ||
        user.role.toLowerCase().includes(payload.toLowerCase())
    );

    dispatch({ type: "SEARCH_USER", payload: filteredUsers });

    if (payload === "") {
      setItems(state.users);
    }
  };

  return (
    <UserContext.Provider
      value={{
        state: state.users,
        dispatch,
        setItems,
        removeUser,
        searchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
