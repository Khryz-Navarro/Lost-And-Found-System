import { FaGithub, FaFacebook, FaLinkedin, FaTiktok } from "react-icons/fa";
import { useState } from "react";
import { useEffect, useRef } from "react";
import ItemsList from "./ItemsList";
import SiteStats from "./SiteStats";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  // const [loading] = useState(true);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (itemName) => {
    setSearchQuery(itemName);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-black py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Lost Something?
          </h1>
          <p className="text-xl mb-8">
            Find your lost items quickly and easily with our lost & found system
          </p>
          <div className="max-w-2xl mx-auto relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search for lost items (e.g., 'blue jacket', 'math book')"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                {filteredSuggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.name)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors">
                    {item.name}
                    <span className="ml-2 text-sm text-gray-500">
                      ({item.type.toLowerCase()})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Lost Item</h3>
              <p className="text-gray-600">
                Quickly report your lost item with details and last seen
                location
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search Found Items</h3>
              <p className="text-gray-600">
                Browse through recently found items by students and staff
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Claim Your Item</h3>
              <p className="text-gray-600">
                Safely claim your item after verification process
              </p>
            </div>
          </div>
          <div className="items-center">
            <SiteStats />
          </div>
        </div>
      </div>
      {/* Recent Items Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recently Found Items
          </h2>
          <ItemsList />
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Lost And Found</h4>
              <p className="text-gray-400">
                Helping reunite lost items with their owners since 2025
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Socials</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/in/khryz-navarro-b10b9131b/"
                  className="text-gray-400 hover:text-blue-400"
                  target="_blank">
                  <FaLinkedin size={30} />
                </a>
                <a
                  href="https://www.facebook.com/"
                  className="text-gray-400 hover:text-blue-400"
                  target="_blank">
                  <FaFacebook size={30} />
                </a>
                <a
                  href="https://github.com/Khryz-Navarro/Lost-Found"
                  className="text-gray-400 hover:text-blue-400"
                  target="_blank">
                  <FaGithub size={30} />
                </a>
                <a
                  href="https://www.tiktok.com/@khryznavarro"
                  className="text-gray-400 hover:text-blue-400"
                  target="_blank">
                  <FaTiktok size={30} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: lostandfound@usm.edu.ph</li>
                <li>Phone: (555) 123-4567</li>
                <li>University of Southern Mindanao Main Campus</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Lost And Found. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
