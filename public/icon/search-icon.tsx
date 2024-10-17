import React from "react";

interface SearchIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const SearchIcon: React.FC<SearchIconProps> = ({
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
      <circle
        cx="10.3769"
        cy="11.2325"
        r="7.85001"
        stroke="#0A2533"
        stroke-width="1.24991"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.8364 17.1L18.9141 20.1696"
        stroke="#0A2533"
        stroke-width="1.24991"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default SearchIcon;
