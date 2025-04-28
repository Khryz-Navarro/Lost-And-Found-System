import React from "react";

const PaginationControls = ({
  currentPage,
  onPrevPage,
  onNextPage,
  hasMore,
}) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        onClick={onPrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
        Previous
      </button>
      <span className="px-4 py-2">Page {currentPage}</span>
      <button
        onClick={onNextPage}
        disabled={!hasMore}
        className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50">
        Next
      </button>
    </div>
  );
};

export default PaginationControls;
