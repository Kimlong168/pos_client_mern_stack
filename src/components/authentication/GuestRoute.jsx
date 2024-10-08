import PropTypes from "prop-types";
import { useLocation, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const GuestRoute = ({ element: Element, ...rest }) => {
  const { user } = useContext(AuthContext);
  // const user = null;
  const location = useLocation();

  if (user) {
    // Redirect them to the dashboard page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Element {...rest} />;
};

GuestRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default GuestRoute;
