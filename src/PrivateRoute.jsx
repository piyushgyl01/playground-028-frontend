import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location }} />
  );
}