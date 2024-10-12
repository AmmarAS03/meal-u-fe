import React from "react";

const SkeletonCommunityCard: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2 mt-2 animate-pulse">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex flex-row">
          <div className="mb-4 w-[70%]">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="flex space-x-2 mb-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-[100px] h-[80px] bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-1"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full mr-1"></div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCommunityCard;