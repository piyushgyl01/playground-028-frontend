import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "./components/LoadingSpinner";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const location = useLocation();

  if (status === "loading") {
    return <LoadingSpinner />;
  }
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/auth" state={{ from: location }} />
  );
}
