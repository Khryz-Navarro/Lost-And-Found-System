import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getCountFromServer, getDocs } from "firebase/firestore";
import { BarLoader } from "react-spinners";

const SiteStats = () => {
  const [stats, setStats] = useState({
    onlineUsers: 0,
    totalUsers: 0,
    listedItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get listed items count
        const itemsCol = collection(db, "items");
        const itemsSnapshot = await getCountFromServer(itemsCol);

        // Get total users count
        const usersCol = collection(db, "users");
        const usersSnapshot = await getCountFromServer(usersCol);

        setStats({
          listedItems: itemsSnapshot.data().count || 0,
          totalUsers: usersSnapshot.data().count,
          onlineUsers: 0, // Still requires presence system
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Add error state to show in UI
        setError("Failed to load statistics");
        setStats({
          listedItems: "N/A",
          totalUsers: "N/A",
          onlineUsers: "N/A",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <BarLoader color="#3b82f6" loading={loading} size={80} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-blue-600 font-semibold text-lg">Online Now</h3>
          <p className="text-3xl font-bold text-blue-900">
            {stats.onlineUsers}
          </p>
          <p className="text-sm text-blue-700">Active users</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-green-600 font-semibold text-lg">
            Registered Users
          </h3>
          <p className="text-3xl font-bold text-green-900">
            {stats.totalUsers}
          </p>
          <p className="text-sm text-green-700">Total members</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-purple-600 font-semibold text-lg">
            Listed Items
          </h3>
          <p className="text-3xl font-bold text-purple-900">
            {stats.listedItems}
          </p>
          <p className="text-sm text-purple-700">Lost & found items</p>
        </div>
      </div>
    </div>
  );
};

export default SiteStats;
