import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../../components/common/LoadingScreen";

const ProtectedRoute = ({ children, role }) => {
  const { user, role: userRole, isActive, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (user && !isActive) return <Navigate to="/locked" replace />;

  if (role && userRole !== role) {
    if (role === 'admin' && userRole === 'user') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;