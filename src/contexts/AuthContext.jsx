// context/AuthContext.js
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  refreshToken as apiRefreshToken,
  refreshToken,
} from "../hooks/authentication/useAuth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // login function
  const login = async (credentials) => {
    const result = await apiLogin(credentials);

    console.log("data: ", result);

    if (result.status === "success") {
      // store user data in local storage
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("token", JSON.stringify(result.data.token));
      localStorage.setItem(
        "refreshToken",
        JSON.stringify(result.data.refreshToken)
      );
      setUser(result.data.user);

      return true;
    }

    return false;
  };

  // logout function
  const logout = async () => {
    const data = await apiLogout();

    console.log("data logout: ", data);
    if (data.status === "success") {
      // remove user data from local storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      return true;
    }

    return false;
  };

  const register = async (credentials) => {
    const result = await apiRegister(credentials);

    console.log("data: ", result);

    if (result.status === "success") {
      return {
        status: "success",
        data: result.data,
      };
    }

    return {
      status: "error",
      error: result.error,
    };
  };
  // refresh token
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        apiRefreshToken();
      }, 15 * 60 * 1000); // refresh every 15 minute

      return () => clearInterval(interval);
    }
  }, [user]);

  // refresh token on first load
  useEffect(() => {
    if (user) {
      apiRefreshToken();
      // console.log("refresh token on first load");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
