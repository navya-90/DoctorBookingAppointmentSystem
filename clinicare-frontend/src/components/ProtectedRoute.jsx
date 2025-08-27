import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../authUtil";

const ProtectedRoute = ({ children }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
