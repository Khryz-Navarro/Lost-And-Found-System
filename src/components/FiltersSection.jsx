import React from "react";

const FiltersSection = ({
  filters,
  sortBy,
  searchQuery,
  categories,
  onFilterChange,
  onSortChange,
  onSearchChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Type
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.itemType}
            onChange={(e) => onFilterChange("itemType", e.target.value)}>
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
            onChange={(e) => onFilterChange("category", e.target.value)}>
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
            Status
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}>
            <option value="all">All</option>
            <option value="unclaimed">Unclaimed</option>
            <option value="claimed">Claimed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            placeholder="Search items..."
            className="w-full p-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
