import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../backend/firebase";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for admin auth
    const checkAdminAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth");
      if (adminAuth) {
        try {
          const { timestamp } = JSON.parse(adminAuth);
          const now = new Date().getTime();
          const fourHours = 4 * 60 * 60 * 1000;

          if (now - timestamp > fourHours) {
            localStorage.removeItem("adminAuth");
            setIsAdmin(false);
          } else {
            setIsAdmin(true);
          }
        } catch (error) {
          localStorage.removeItem("adminAuth");
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    // Check for regular user auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    checkAdminAuth();
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      if (isAdmin) {
        localStorage.removeItem("adminAuth");
        setIsAdmin(false);
      } else {
        await signOut(auth);
      }
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          USM Lost & Found
        </Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/lost-items" className="text-gray-700 hover:text-blue-600">
            Lost Items
          </Link>
          <Link to="/found-items" className="text-gray-700 hover:text-blue-600">
            Found Items
          </Link>

          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <span className="bg-gray-200 p-2 rounded-full">Admin</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Administrator
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : user ? (
            <>
              <Link
                to="/report-lost"
                className="text-gray-700 hover:text-blue-600">
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="text-gray-700 hover:text-blue-600">
                Report Found
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
