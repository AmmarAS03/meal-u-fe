import React from "react";

interface WareThreeIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const WareThreeIcon: React.FC<WareThreeIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M10 17.5V21.25M15 17.5V21.25M20 17.5V21.25M3.75 26.25H26.25M3.75 12.5H26.25M3.75 8.75L15 3.75L26.25 8.75M5 12.5H25V26.25H5V12.5Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default WareThreeIcon;
