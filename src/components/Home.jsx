import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../backend/firebase";
import { useAuth } from "../contexts/AuthContext"; // Make sure you have AuthContext set up

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [itemType, setItemType] = useState("all");
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { currentUser, isAdmin } = useAuth(); // Add this hook

  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Accessories",
    "Documents",
    "Others",
  ];

  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    type: "lost",
    location: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        let itemsQuery = collection(db, "items");

        if (itemType !== "all") {
          itemsQuery = query(itemsQuery, where("type", "==", itemType));
        }

        const querySnapshot = await getDocs(itemsQuery);
        const itemsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(itemsList);
        setError(null);
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemType]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, "items"), {
        ...formData,
        createdAt: new Date(),
        userId: currentUser.uid,
      });
      setItems([...items, { id: docRef.id, ...formData }]);
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        category: "Electronics",
        type: "lost",
        location: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
    } catch (err) {
      setError("Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "items", itemId));
        setItems(items.filter((item) => item.id !== itemId));
      } catch (err) {
        setError("Failed to delete item");
      }
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "items", selectedItem.id), formData);
      setItems(
        items.map((item) =>
          item.id === selectedItem.id ? { ...item, ...formData } : item
        )
      );
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const filteredItems = items.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
        Welcome to USM Lost & Found
      </h2>

      {isAdmin && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Item
        </button>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="p-2 border rounded-md"
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}>
          <option value="all">All Items</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>

        <select
          className="p-2 border rounded-md"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div
              className={`text-sm font-semibold ${
                item.type === "lost" ? "text-red-600" : "text-green-600"
              } mb-2`}>
              {item.type.toUpperCase()}
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600">Category: {item.category}</p>
            <p className="text-gray-600">Location: {item.location}</p>
            <p className="text-gray-600">
              Date: {new Date(item.date).toLocaleDateString()}
            </p>
            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setFormData(item);
                    setIsEditModalOpen(true);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-4">
          No items found matching the selected filters.
        </p>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add New Item</h3>
            <form onSubmit={handleAddItem}>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border mb-2 rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <select
                className="w-full p-2 border mb-2 rounded"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 border mb-2 rounded"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <input
                type="text"
                placeholder="Location"
                className="w-full p-2 border mb-2 rounded"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
              <input
                type="date"
                className="w-full p-2 border mb-2 rounded"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border mb-2 rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Edit Item</h3>
            <form onSubmit={handleEditItem}>
              {/* Same form fields as Add Modal */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
