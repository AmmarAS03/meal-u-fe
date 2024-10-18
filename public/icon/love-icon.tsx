import React from "react";

interface LoveIconProps {
  color?: string;
  selectedColor?: string;
  liked?: boolean;
  width?: string;
  height?: string;
}

const LoveIcon: React.FC<LoveIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  liked = false,
  width = "18",
  height = "19",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "18"}
      height={height ? height : "19"}
      viewBox="0 0 18 19"
      fill={liked ? "#c22335" : "none"}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.13524 9.37789C1.33748 6.88719 2.26982 4.04036 4.88468 3.19799C6.26014 2.75412 7.77835 3.01583 8.92184 3.87605C10.0036 3.03962 11.5776 2.75709 12.9516 3.19799C15.5664 4.04036 16.5047 6.88719 15.7077 9.37789C14.4661 13.3258 8.92184 16.3667 8.92184 16.3667C8.92184 16.3667 3.41851 13.3719 2.13524 9.37789Z"
        stroke="#48525F"
        stroke-width="1.11524"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default LoveIcon;
