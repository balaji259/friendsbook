import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-dashed rounded-full animate-spin"></div>

        {/* Text below spinner */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-gray-500 font-semibold animate-pulse">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
