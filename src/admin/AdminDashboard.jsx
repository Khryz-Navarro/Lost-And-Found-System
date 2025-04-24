import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../backend/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [statistics, setStatistics] = useState({
    totalLost: 0,
    totalFound: 0,
    resolved: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/login");
      return;
    }

    // Set up real-time listeners for lost and found items
    const lostItemsQuery = query(
      collection(db, "items"),
      where("type", "==", "lost")
    );
    const foundItemsQuery = query(
      collection(db, "items"),
      where("type", "==", "found")
    );

    const unsubscribeLost = onSnapshot(lostItemsQuery, (snapshot) => {
      const lostItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateItems(lostItems, "lost");
    });

    const unsubscribeFound = onSnapshot(foundItemsQuery, (snapshot) => {
      const foundItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updateItems(foundItems, "found");
    });

    return () => {
      unsubscribeLost();
      unsubscribeFound();
    };
  }, [navigate]);

  const updateItems = (newItems, type) => {
    setItems((prevItems) => {
      const filteredItems = prevItems.filter((item) => item.type !== type);
      const combinedItems = [...filteredItems, ...newItems];

      // Update statistics
      const stats = {
        totalLost: 0,
        totalFound: 0,
        resolved: 0,
      };

      combinedItems.forEach((item) => {
        if (item.type === "lost") stats.totalLost++;
        if (item.type === "found") stats.totalFound++;
        if (item.status === "resolved") stats.resolved++;
      });

      setStatistics(stats);
      setIsLoading(false);
      return combinedItems;
    });
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", id));
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "resolved" ? "pending" : "resolved";
    try {
      await updateDoc(doc(db, "items", id), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Lost Items
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {statistics.totalLost}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Found Items
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {statistics.totalFound}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Resolved Cases
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {statistics.resolved}
              </dd>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Items Management
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title || item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      item.status === "resolved"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}>
                    {item.status}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Type:{" "}
                  <span
                    className={`font-medium ${
                      item.type === "lost" ? "text-red-600" : "text-blue-600"
                    }`}>
                    {item.type}
                  </span>
                </p>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleUpdateStatus(item.id, item.status)}
                    className={`px-3 py-1 text-white text-sm rounded ${
                      item.status === "resolved"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}>
                    {item.status === "resolved"
                      ? "Mark Pending"
                      : "Mark Resolved"}
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
