import { Navigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
const LiveOnlyRoute = ({ children }) => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return null; // or a loader

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.app_mode !== "live") {
    return <Navigate to="/upgrade" />;
  }

  return children;
};

export default LiveOnlyRoute;
