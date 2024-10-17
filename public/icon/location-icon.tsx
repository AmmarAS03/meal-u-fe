import React from "react";

interface LocationIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const LocationIcon: React.FC<LocationIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.9636 11.3805C15.9636 9.93297 14.7907 8.76001 13.3442 8.76001C11.8966 8.76001 10.7236 9.93297 10.7236 11.3805C10.7236 12.8271 11.8966 14 13.3442 14C14.7907 14 15.9636 12.8271 15.9636 11.3805Z"
        stroke="#7862FC"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.3434 22.384C12.0874 22.384 5.48389 17.0375 5.48389 11.4463C5.48389 7.06921 9.00213 3.52002 13.3434 3.52002C17.6846 3.52002 21.2039 7.06921 21.2039 11.4463C21.2039 17.0375 14.5994 22.384 13.3434 22.384Z"
        stroke="#7862FC"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default LocationIcon;
