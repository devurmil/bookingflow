import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, role: userRole, loading } = useAuth(); // Assuming loading is available from AuthContext

  if (loading) return <div>Loading...</div>; // Or a proper loading spinner

  if (!user) return <Navigate to="/login" replace />;

  // If the route requires a specific role (e.g. 'admin') and the user doesn't have it
  if (role && userRole !== role) {
    // If a regular user tries to go to admin pages, send them home
    if (role === 'admin' && userRole === 'user') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;