import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import GoogleSignIn from "./GoogleSignIn";
import { Link, useNavigate } from "react-router-dom";
import Usm from "../assets/usm_logo_192x192.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Set authentication persistence
      await auth.setPersistence(rememberMe ? "local" : "session");

      // Sign in with email/password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if email is verified (optional)
      if (!userCredential.user.emailVerified) {
        // Handle unverified email if needed
      }

      // Redirect is handled automatically by useAuth in App.jsx
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        USM LOST AND FOUND ITEMS
      </h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error message display */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="flex justify-center mb-4">
              <img src={Usm} alt={Usm} />
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm flex">
                <p className="text-black mr-1">Dont have an account?</p>
                <Link
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign Up
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot Password
                </Link>
              </div>
              <div className="text-sm flex">
                <a
                  href="#TOS" //redirect to Terms of Service page
                  className="font-medium text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </a>
              </div>
            </div>

            <div>
              <div>
                <button
                  type="submit"
                  disabled={!email || !password}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  Sign in
                </button>
              </div>
            </div>
            <div>
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <GoogleSignIn />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
