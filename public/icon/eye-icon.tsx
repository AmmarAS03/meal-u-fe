import React from "react";

interface EyeIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const EyeIcon: React.FC<EyeIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.4217 10.6389C13.4217 12.1696 12.1804 13.41 10.6497 13.41C9.11907 13.41 7.8786 12.1696 7.8786 10.6389C7.8786 9.10741 9.11907 7.86694 10.6497 7.86694C12.1804 7.86694 13.4217 9.10741 13.4217 10.6389Z"
        stroke="#97A2B0"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.6484 17.0401C13.9867 17.0401 17.0401 14.6398 18.7592 10.6388C17.0401 6.63771 13.9867 4.23743 10.6484 4.23743H10.6519C7.31359 4.23743 4.2602 6.63771 2.54108 10.6388C4.2602 14.6398 7.31359 17.0401 10.6519 17.0401H10.6484Z"
        stroke="#97A2B0"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default EyeIcon;
