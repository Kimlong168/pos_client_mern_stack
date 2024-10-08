import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ roles, element: Element, ...rest }) => {
  const token = JSON.parse(localStorage.getItem("token"));

  const location = useLocation();
  if (!token) {
    const getQueryParam = (param) => {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get(param);
    };

    // if user get the url from scanning the qr code
    const attValue = getQueryParam("att");

    if (attValue) {
      return <Navigate to={`/login?att=${attValue}`} />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  try {
    const decodedToken = jwtDecode(token);

    console.log("decoded token: ", decodedToken);

    if (decodedToken && roles.includes(decodedToken.role)) {
      return <Element {...rest} />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  } catch (error) {
    return <Navigate to="/unauthorized" />;
  }
};

PrivateRoute.propTypes = {
  roles: PropTypes.array,
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
