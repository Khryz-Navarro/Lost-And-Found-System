import { Link } from "react-router-dom";
import { auth, signOutUser } from "../firebase";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/home" className="text-2xl font-bold text-blue-600">
              Lost & Found
            </Link>
            <div className="hidden md:block ml-10">
              <nav className="flex space-x-4">
                <Link
                  to="/home"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  Home
                </Link>
                <Link
                  to="/report"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  Report Item
                </Link>
                <Link
                  to="/items"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  Browse Items
                </Link>
                <Link
                  to="/archived"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  Archived Items
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                  UserProfile
                </Link>
              </nav>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
