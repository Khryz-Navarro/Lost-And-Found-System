import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import { BarLoader } from "react-spinners";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.isAdmin) {
      const q = query(collection(db, "items"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const itemsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate(),
          }));
          setItems(itemsData);
          setLoading(false);
        },
        (error) => {
          setError("Error fetching items: " + error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", itemId));
        setError("");
      } catch (error) {
        setError("Error deleting item: " + error.message);
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600">Unauthorized Access</h2>
        <p className="mt-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <BarLoader color="#36d7b7" loading={loading} size={150} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
                    Delete
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="text-sm space-y-1">
                  <p>Category: {item.category}</p>
                  <p>Status: {item.status}</p>
                  <p>Submitted by: {item.reportedBy}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
