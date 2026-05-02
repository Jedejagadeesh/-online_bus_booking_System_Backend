import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAuthenticated, setShowLogin } = useAuth();

  if (!isAuthenticated()) {
    setShowLogin(true);
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;