import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute Component
 * 
 * This component protects routes that require authentication.
 * It checks if a valid JWT token exists in localStorage.
 * 
 * Usage: <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
 */
function ProtectedRoute({ element }) {
  // GET TOKEN FROM LOCALSTORAGE
  const token = localStorage.getItem("token");

  // IF NO TOKEN EXISTS, REDIRECT TO LOGIN
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // TOKEN EXISTS, ALLOW ACCESS TO PROTECTED PAGE
  return element;
}

export default ProtectedRoute;
