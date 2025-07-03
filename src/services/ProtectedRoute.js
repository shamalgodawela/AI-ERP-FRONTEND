import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/All-in-one-Login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/Unotherized" />;

  return <Outlet />;
};

export default ProtectedRoute;
