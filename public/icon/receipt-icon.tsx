import React from "react";

interface ReceiptIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const ReceiptIcon: React.FC<ReceiptIconProps> = ({
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
        d="M14.4092 2.74355V2.74355C15.7313 2.74355 16.8031 3.81533 16.8031 5.13745L16.8031 6.84737C16.8031 7.11398 16.8031 7.24729 16.7419 7.34461C16.71 7.39537 16.6671 7.4383 16.6164 7.47019C16.519 7.53134 16.3857 7.53134 16.1191 7.53134L12.0153 7.53134M14.4092 2.74355V2.74355C13.0871 2.74355 12.0153 3.81533 12.0153 5.13745L12.0153 7.53134M14.4092 2.74355L5.63163 2.74355C4.12694 2.74355 3.37459 2.74355 2.90714 3.21099C2.4397 3.67844 2.4397 4.43079 2.4397 5.93548L2.4397 17.1069L4.8336 16.309L7.22749 17.1069L9.62139 16.309L12.0153 17.1069L12.0153 7.53134"
        stroke={currentColor}
        stroke-width="1.19697"
      />
      <path
        d="M5.63281 5.93506L8.82468 5.93506"
        stroke={currentColor}
        stroke-width="1.19697"
        stroke-linecap="round"
      />
      <path
        d="M6.42981 9.12646H5.63184"
        stroke={currentColor}
        stroke-width="1.19697"
        stroke-linecap="round"
      />
      <path
        d="M5.63281 12.3186L8.02671 12.3186"
        stroke={currentColor}
        stroke-width="1.19697"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default ReceiptIcon;
