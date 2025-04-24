import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../backend/firebase";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  // Check for admin authentication if route requires admin access
  if (adminOnly) {
    const adminAuth = localStorage.getItem("adminAuth");
    if (!adminAuth) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
      const { timestamp, isAdmin } = JSON.parse(adminAuth);
      const now = new Date().getTime();
      const fourHours = 4 * 60 * 60 * 1000;

      if (!isAdmin || now - timestamp > fourHours) {
        localStorage.removeItem("adminAuth");
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    } catch (error) {
      localStorage.removeItem("adminAuth");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // For non-admin routes, check regular user authentication
  if (!user && !adminOnly) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
