import React from "react";

interface FourDotIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const FourDotIcon: React.FC<FourDotIconProps> = ({
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
        d="M13.75 7.3525V24.05C13.7496 24.5681 13.5664 25.0694 13.2326 25.4657C12.8989 25.8619 12.436 26.1277 11.9255 26.2161C11.415 26.3046 10.8897 26.21 10.4421 25.9491C9.99451 25.6883 9.65334 25.2778 9.47871 24.79L6.79496 17.1025M6.79496 17.1025C5.73398 16.6514 4.86144 15.8488 4.325 14.8283C3.78855 13.8078 3.62115 12.6334 3.85113 11.5036C4.0811 10.3739 4.69433 9.35832 5.58702 8.62875C6.47972 7.89918 7.59706 7.50044 8.74996 7.5H11.04C16.165 7.5 20.5712 5.9575 22.5 3.75V21.25C20.5712 19.0425 16.1662 17.5 11.04 17.5H8.74996C8.07825 17.501 7.41327 17.3649 6.79496 17.1025ZM22.5 16.25C23.4945 16.25 24.4483 15.8549 25.1516 15.1517C25.8549 14.4484 26.25 13.4946 26.25 12.5C26.25 11.5054 25.8549 10.5516 25.1516 9.84835C24.4483 9.14509 23.4945 8.75 22.5 8.75"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default FourDotIcon;
