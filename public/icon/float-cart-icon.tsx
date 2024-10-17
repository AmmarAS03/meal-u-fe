import React from "react";

interface FloatCartIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const FloatCartIcon: React.FC<FloatCartIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="45"
      height="43"
      viewBox="0 0 45 43"
      fill="none"
    >
      <rect
        x="0.225586"
        y="0.768066"
        width="44.3557"
        height="41.92"
        rx="8.384"
        fill="#0A2533"
      />
      <path
        d="M11.4912 12.558L13.6711 12.9353L14.6803 24.959C14.761 25.9409 15.5816 26.6945 16.5667 26.6913H27.9993C28.9394 26.6934 29.7369 26.0017 29.87 25.0711L30.8645 18.1983C30.9756 17.4301 30.4422 16.7175 29.6751 16.6064C29.608 16.597 14.0211 16.5917 14.0211 16.5917"
        stroke="white"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M23.4126 20.465H26.3187"
        stroke="white"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M16.1072 30.3243C16.4227 30.3243 16.6773 30.5801 16.6773 30.8945C16.6773 31.2099 16.4227 31.4656 16.1072 31.4656C15.7918 31.4656 15.5371 31.2099 15.5371 30.8945C15.5371 30.5801 15.7918 30.3243 16.1072 30.3243Z"
        fill="white"
        stroke="white"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M27.929 30.3243C28.2444 30.3243 28.5002 30.5801 28.5002 30.8945C28.5002 31.2099 28.2444 31.4656 27.929 31.4656C27.6136 31.4656 27.3589 31.2099 27.3589 30.8945C27.3589 30.5801 27.6136 30.3243 27.929 30.3243Z"
        fill="white"
        stroke="white"
        stroke-width="1.572"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FloatCartIcon;
