import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../backend/firebase";
import { useNavigate } from "react-router-dom";

function ReportLostItem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    dateSubmitted: "",
    timeLost: "",
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("You must be logged in to report an item");
      }

      await addDoc(collection(db, "lostItems"), {
        ...item,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
        status: "pending",
      });

      navigate("/lost-items");
    } catch (error) {
      console.error("Error reporting lost item:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          Report Lost Item
        </h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            name="name"
            value={item.name}
            onChange={handleChange}
            placeholder="e.g., Blue Backpack"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="Please provide detailed description..."
            className="w-full p-2 border rounded h-24 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Last Seen Location
          </label>
          <input
            name="location"
            value={item.location}
            onChange={handleChange}
            placeholder="e.g., Main Library, 2nd Floor"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Contact Information
          </label>
          <input
            name="contact"
            value={item.contact}
            onChange={handleChange}
            placeholder="Phone number or email"
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date Lost
          </label>
          <input
            type="date"
            name="dateSubmitted"
            value={item.dateSubmitted}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Time Lost
          </label>
          <input
            type="time"
            name="timeLost"
            value={item.timeLost}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-2 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white font-medium`}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportLostItem;
