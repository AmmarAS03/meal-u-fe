import React from 'react';

const HomeImageCard = () => {
  return (
    <div className="relative w-[65vw] h-30 rounded-3xl overflow-hidden">
      {/* Background image */}
      <img 
        src="/img/HomeCard.png" 
        alt="Asian food background" 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Title */}
        <h2 className="text-white text-md font-bold w-[70%]">Asian Food Specialist</h2>
        
        {/* Bottom row with profile and followers */}
        <div className="flex items-end justify-between">
          {/* Profile */}
          <div className="flex items-center">
            <img 
              src="/img/no-photo.png" 
              alt="Uncle Roger" 
              className="w-8 h-8 rounded-full mr-1"
            />
            <span className="text-white text-xs">Uncle Roger</span>
          </div>
          
          {/* Followers */}
          <div className="flex items-center">
            <svg className="w-5 h-5 text-white mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-white text-sm">2M</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeImageCard;