import React, { useState, useEffect, memo } from "react";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../backend/firebase";

// Memoized item card component for better performance
const ItemCard = memo(({ item }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow">
    <h3 className="font-bold text-lg text-blue-800">{item.name}</h3>
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
            item.status === "found"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      </div>
    )}
  </div>
));

ItemCard.displayName = "ItemCard";

function LostItems() {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLostItems = async () => {
    try {
      const q = query(
        collection(db, "lostItems"),
        where("status", "!=", "found"),
        orderBy("status"),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toLocaleDateString(),
      }));

      setLostItems(items);
      setError(null);
    } catch (err) {
      console.error("Error fetching lost items:", err);
      setError(`Failed to load lost items: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchLostItems();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-md">
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchLostItems}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Reported Lost Items
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lostItems.length === 0 ? (
          <p className="text-center text-gray-500 p-4 col-span-full">
            No lost items have been reported yet.
          </p>
        ) : (
          lostItems.map((item) => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}

export default memo(LostItems);
