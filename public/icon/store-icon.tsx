import React from "react";

interface StoreIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const StoreIcon: React.FC<StoreIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  const currentColor = selected ? selectedColor : color;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7.382 2.74207H10.1897H13.2781M7.382 2.74207H4.01281C4.01281 2.74207 2.1681 7.99656 2.32821 8.07662C2.48832 8.15667 2.6781 8.24015 2.88974 8.31989M7.382 2.74207V7.79585M7.382 7.79585C6.22645 9.14399 4.16266 8.7995 2.88974 8.31989M7.382 7.79585C7.94353 8.17021 9.06659 8.91892 10.1897 8.91892C11.3127 8.91892 12.7165 8.17021 13.2781 7.79585M2.88974 8.31989V16.4996C2.88974 16.9675 3.11435 17.9034 4.01281 17.9034H10.1897H16.6473C17.5457 17.9034 17.7703 16.9675 17.7703 16.4996V8.31989M13.2781 2.74207H16.6473C16.6473 2.74207 18.492 7.99656 18.3319 8.07662C18.1718 8.15667 17.982 8.24015 17.7703 8.31989M13.2781 2.74207V7.79585M13.2781 7.79585C14.4336 9.14399 16.4974 8.7995 17.7703 8.31989"
        stroke={currentColor}
        stroke-width="1.19697"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default StoreIcon;
