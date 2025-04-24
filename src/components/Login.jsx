import { useState, useEffect } from "react";
import { auth } from "../backend/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { ADMIN_CREDENTIALS } from "../config/adminConfig";

const Login = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        // Redirect back to the previous page or home
        navigate(location.state?.from || "/");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      if (err.code === "auth/cancelled-popup-request") {
        setError("Sign-in was cancelled");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError("");

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        adminCredentials.username === ADMIN_CREDENTIALS.username &&
        adminCredentials.password === ADMIN_CREDENTIALS.password
      ) {
        // Store admin authentication data
        const authData = JSON.stringify({
          timestamp: new Date().getTime(),
          username: adminCredentials.username,
          isAdmin: true,
        });

        localStorage.setItem("adminAuth", authData);

        // Clear any existing user auth if present
        if (user) {
          await handleSignOut();
        }

        // Redirect to admin dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("An error occurred during admin login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-lg">
      {user ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user.displayName}!
          </h2>
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto"
            referrerPolicy="no-referrer"
          />
          <p className="text-gray-600">Email: {user.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Login to Your Account
            </h1>
            <p className="text-gray-600">Please sign in to continue</p>
          </div>

          {error && (
            <p className="p-3 bg-red-100 text-red-600 rounded-md">{error}</p>
          )}

          {showAdminLogin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) =>
                    setAdminCredentials((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) =>
                    setAdminCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? "Signing in..." : "Sign in as Admin"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                  Back to User Login
                </button>
              </div>
            </form>
          ) : (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <FcGoogle className="text-xl" />
                <span className="text-gray-700 font-medium">
                  {isLoading ? "Signing in..." : "Continue with Google"}
                </span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <button
                onClick={() => setShowAdminLogin(true)}
                className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
                Login as Admin
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
