import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../authUtil";

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" />;
  }

  if (allowedRoles) {
    const savedUser = localStorage.getItem("clinicare_user");
    if (!savedUser) {
      return <Navigate to="/" />;
    }
    try {
      const user = JSON.parse(savedUser);
      if (!allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN') return <Navigate to="/admin-dashboard" />;
        if (user.role === 'DOCTOR') return <Navigate to="/doctor-dashboard" />;
        return <Navigate to="/patient-dashboard" />;
      }
    } catch (e) {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
