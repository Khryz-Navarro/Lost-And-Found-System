import React, { useState, useCallback, memo } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../backend/firebase";
import { useNavigate } from "react-router-dom";

// Memoized form input component
const FormInput = memo(({ label, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...props}
      className="w-full p-2 border rounded focus:ring-green-500 focus:border-green-500"
    />
  </div>
));

FormInput.displayName = "FormInput";

function ReportFoundItem() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    dateSubmitted: "",
    timeLost: "",
  });

  // Memoized change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("You must be logged in to report an item");
        }

        const docRef = await addDoc(collection(db, "foundItems"), {
          ...item,
          userId: user.uid,
          userEmail: user.email,
          timestamp: serverTimestamp(),
          status: "pending",
        });

        if (docRef.id) {
          navigate("/found-items");
        }
      } catch (error) {
        console.error("Error reporting found item:", error);
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [item, isSubmitting, navigate]
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl font-semibold text-green-700">
          Report Found Item
        </h2>

        <FormInput
          label="Item Name"
          name="name"
          value={item.name}
          onChange={handleChange}
          placeholder="e.g., Blue Wallet"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            placeholder="Please provide detailed description..."
            className="w-full p-2 border rounded h-24 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <FormInput
          label="Found Location"
          name="location"
          value={item.location}
          onChange={handleChange}
          placeholder="e.g., Main Library, 2nd Floor"
          required
        />

        <FormInput
          label="Contact Information"
          name="contact"
          value={item.contact}
          onChange={handleChange}
          placeholder="Phone number or email"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date Found
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
            Time Found
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
              : "bg-green-600 hover:bg-green-700"
          } text-white font-medium`}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

export default memo(ReportFoundItem);
