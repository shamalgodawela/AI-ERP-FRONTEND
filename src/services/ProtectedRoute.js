import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log('ProtectedRoute - Current user:', user);
  console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  console.log('ProtectedRoute - User role:', user?.role);

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/All-in-one-Login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not allowed, redirecting to unauthorized');
    return <Navigate to="/Unotherized" />;
  }

  console.log('ProtectedRoute - Access granted');
  return <Outlet />;
};

export default ProtectedRoute;
