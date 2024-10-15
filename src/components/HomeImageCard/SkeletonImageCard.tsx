import React from 'react';

const SkeletonHomeImageCard: React.FC = () => {
  return (
    <div className="relative w-[65vw] h-30 rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
      {/* Overlay content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Title */}
        <div className="w-[70%] h-5 bg-gray-300 rounded"></div>
        
        {/* Bottom row with profile and followers */}
        <div className="flex items-end justify-between">
          {/* Profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 mr-1"></div>
            <div className="w-20 h-3 bg-gray-300 rounded"></div>
          </div>
          
          {/* Followers */}
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
            <div className="w-8 h-3 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonHomeImageCard;