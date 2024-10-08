import axios from "axios";
import axiosClient from "../../api/axiosClient";
import { notify } from "../../utils/toastify";
// import { getAuthHeaders } from "../../utils/authHeaders";
const apiUrl = import.meta.env.VITE_API_URL;

// login function
export const login = async (credentials) => {
  try {
    const response = await axiosClient.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  } catch (error) {
    console.log("Login error: ", error.response.data);

    return error.response.data;
  }
};

// logout function
export const logout = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await axiosClient.post("/auth/logout", {
      ...user,
    });

    return response.data;
  } catch (error) {
    console.log("Logout error: ", error.response.data);

    return error.response.data;
  }
};

export const register = async (credentials) => {
  try {
    const response = await axiosClient.post("/auth/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    });

    return response.data;
  } catch (error) {
    console.log("Register error: ", error.response.data);

    return error.response.data;
  }
};

// refresh token function
export const refreshToken = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

  const tokenType = "Bearer";

  // console.log("refreshToken", refreshToken);

  if (refreshToken) {
    try {
      const response = await axios.post(
        `${apiUrl}/auth/refresh-token`,
        { email: user.email }, // Include email in the body
        {
          headers: {
            Authorization: `${tokenType} ${refreshToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("response token", response.data);

      if (response.data?.status === "success") {
        // Update the token and refresh_token properties
        const newToken = response.data.data.token;
        const newUserData = response.data.data.user;
        const newRefreshToken = response.data.data.refreshToken;

        // console.log("Token refreshed", newToken);

        // Save the updated JSON string back to localStorage
        localStorage.setItem("token", JSON.stringify(newToken));
        localStorage.setItem("user", JSON.stringify(newUserData));
        localStorage.setItem("refreshToken", JSON.stringify(newRefreshToken));
        return response.data;
      } else {
        throw new Error(
          "Error refreshing token: " + response.data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.log("Error refreshing token", error);
      if (error.response.data.status === "error") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // alert("Token expired, please login again");

        notify("Token expired, please login again", "info");
        window.location.href = "/login";
      }
      return false;
    }
  } else {
    console.log("Not Logged In, no refresh token available");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    notify("Token expired, please login again", "info");
    window.location.href = "/login";

    return false;
  }
};
