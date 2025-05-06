import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminRegister = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const functions = getFunctions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Call Firebase Cloud Function
      const grantAdminRole = httpsCallable(functions, "grantAdminRole");
      await grantAdminRole({ email });

      // Create admin document in Firestore
      await setDoc(doc(db, "admins", email), {
        email: email,
        createdAt: new Date(),
        grantedBy: user.email,
      });

      setSuccess(`${email} has been granted admin privileges`);
      setEmail("");
    } catch (err) {
      setError(err.message || "Error granting admin privileges");
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
        <p className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline">
            Return to Home
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Register New Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter user's email"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Granting Admin Access..." : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
