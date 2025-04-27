import { useState } from "react";
import { Link } from "react-router-dom";
import { addItem } from "../firebase";
import { supabase } from "../supabase"; // Add this import
import { uploadImageToSupabase } from "../supabase";

const initialFormState = {
  itemName: "",
  description: "",
  itemType: "lost",
  category: "",
  date: "",
  location: "",
  image: null,
};

const ReportItem = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);

  const categories = [
    "Electronics",
    "Documents",
    "Clothing",
    "Accessories",
    "Books",
    "Others",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.category || !formData.date || !formData.location) {
        alert("Please fill all required fields");
        return;
      }

      let imageUrl = null;
      if (formData.image) {
        setUploading(true);

        // Generate unique filename with folder structure
        const fileName = `items/${Date.now()}_${formData.image.name}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("items")
          .upload(fileName, formData.image);

        if (error) throw error;

        // Get public URL (use the returned data.path)
        const { data: urlData } = supabase.storage
          .from("items")
          .getPublicUrl(data.path);

        imageUrl = urlData.publicUrl;
        setUploading(false);
      }

      // Add to Firestore
      await addItem({
        name: formData.itemName,
        description: formData.description,
        type: formData.itemType,
        category: formData.category,
        date: new Date(formData.date),
        location: formData.location,
        image: imageUrl,
      });

      setFormData(initialFormState);
      alert("Item reported successfully!");
    } catch (error) {
      setUploading(false);
      alert(error.message || "Error submitting report");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Report Lost/Found Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Item Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type
                </label>
                <select
                  name="itemType"
                  value={formData.itemType}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="lost">Lost Item</option>
                  <option value="found">Found Item</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required></textarea>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date {formData.itemType === "lost" ? "Lost" : "Found"}
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                accept="image/*"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                to="/home"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {uploading ? "Uploading..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportItem;
