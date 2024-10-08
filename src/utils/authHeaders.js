export const getAuthHeaders = () => {
  const tokenType = "Bearer";
  const user = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("token"));

  console.log("user: ", user);
  console.log("token: ", token);

  if (user && token) {
    return {
      Authorization: `${tokenType} ${token}`,
      "Content-Type": "application/json",
    };
  } else {
    console.error("User not logged in or token not found");
    return {};
  }
};
