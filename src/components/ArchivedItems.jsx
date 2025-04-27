import { useState, useEffect } from "react";
import { db } from "../firebase";
import { query, collection, where, onSnapshot } from "firebase/firestore";
import { BarLoader } from "react-spinners";

const ArchivedItems = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    itemType: "all",
    category: "all",
  });

  const placeholderImage = "https://placehold.co/600x400";
  const categories = [
    "Electronics",
    "Documents",
    "Clothing",
    "Accessories",
    "Books",
    "Others",
  ];

  useEffect(() => {
    const q = query(collection(db, "items"), where("status", "==", "claimed"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));
      setItems(itemsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesType =
      filters.itemType === "all" || item.type === filters.itemType;
    const matchesCategory =
      filters.category === "all" || item.category === filters.category;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BarLoader color="#36d7b7" loading={loading} size={150} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Type
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.itemType}
                onChange={(e) =>
                  setFilters({ ...filters, itemType: e.target.value })
                }>
                <option value="all">All Types</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }>
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search archived items..."
                className="w-full p-2 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img
                src={item.image || placeholderImage}
                alt={item.name}
                className="w-full h-48 object-cover rounded-t-lg cursor-zoom-in"
                onClick={() => setSelectedImage(item.image)} // Add this
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = placeholderImage;
                }}
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    Claimed
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Type:</span> {item.type}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {item.category}
                  </p>
                  <p>
                    <span className="font-medium">Date Claimed:</span>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {item.location}
                  </p>
                  {item.claimedBy && (
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Claimed By:</span>{" "}
                      {item.claimedBy}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 backdrop-blur-xs bg-opacity-80 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 relative z-50 overflow-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-4 p-6 sticky top-0 bg-white">
                <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl">
                  &times;
                </button>
              </div>

              <div className="p-6">
                {/* <img
                  src={selectedItem.image || placeholderImage}
                  alt={selectedItem.name}
                  className="w-full h-64 object-contain mb-4 rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                /> */}
                <img
                  src={selectedItem.image || placeholderImage}
                  alt={selectedItem.name}
                  className="w-full h-64 object-cover mb-4 rounded-lg cursor-zoom-in"
                  onClick={() => setSelectedImage(selectedItem.image)} // Add this
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedItem.type}
                    </p>
                    <p>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedItem.category}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(selectedItem.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {selectedItem.location}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {selectedItem.status}
                    </p>
                    <p>
                      <span className="font-medium">Submitted By:</span>{" "}
                      {selectedItem.reportedBy}
                    </p>
                    {selectedItem.claimedBy && (
                      <p>
                        <span className="font-medium">Claimed by:</span>{" "}
                        {selectedItem.claimedBy}
                      </p>
                    )}
                  </div>
                </div>
                <p className="mb-4 whitespace-pre-wrap">
                  {selectedItem.description}
                </p>
              </div>
              <div className="sticky bottom-0 bg-white border-t p-4">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    Close
                  </button>
                  {selectedItem.status === "unclaimed" && (
                    <button
                      onClick={() => {
                        handleClaimItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
                      Claim Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 z-50 backdrop-blur-lg bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <img
              src={selectedImage}
              alt="Full resolution"
              className="max-w-[90vw] max-h-[90vh] object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivedItems;
