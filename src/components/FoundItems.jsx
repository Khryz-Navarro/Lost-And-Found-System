import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../backend/firebase";

function FoundItems() {
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add new state variables for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchFoundItems = async () => {
      try {
        const q = query(
          collection(db, "foundItems"),
          orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate().toLocaleDateString(),
        }));
        setFoundItems(items);
      } catch (err) {
        console.error("Error fetching found items:", err);
        setError("Failed to load found items");
      } finally {
        setLoading(false);
      }
    };

    fetchFoundItems();
  }, []);

  // Add filter function
  const filteredItems = foundItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesDate = !dateFilter || item.timestamp === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">
        Found Items
      </h2>

      {/* Add filter controls */}
      <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full p-4">
            No found items match your search criteria.
          </p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-green-800">{item.name}</h3>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <div className="mt-3 space-y-1">
                <p>
                  <strong className="text-gray-700">Location:</strong>{" "}
                  <span className="text-gray-600">{item.location}</span>
                </p>
                <p>
                  <strong className="text-gray-700">Contact:</strong>{" "}
                  <span className="text-gray-600">{item.contact}</span>
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Reported on:</strong> {item.timestamp}
                </p>
                {item.userEmail && (
                  <p className="text-sm text-gray-500">
                    <strong>Reported by:</strong> {item.userEmail}
                  </p>
                )}
              </div>
              {item.status && (
                <div className="mt-2">
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      item.status === "claimed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FoundItems;
