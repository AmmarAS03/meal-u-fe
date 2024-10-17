import React from "react";

interface UserIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const UserIcon: React.FC<UserIconProps> = ({
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.8634 12.5944C6.77717 12.5944 4.1416 13.061 4.1416 14.9297C4.1416 16.7985 6.76045 17.2818 9.8634 17.2818C12.9496 17.2818 15.5844 16.8145 15.5844 14.9465C15.5844 13.0785 12.9663 12.5944 9.8634 12.5944Z"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.86294 9.92893C11.8883 9.92893 13.5298 8.28664 13.5298 6.26133C13.5298 4.23601 11.8883 2.59448 9.86294 2.59448C7.83762 2.59448 6.19533 4.23601 6.19533 6.26133C6.18849 8.2798 7.81939 9.92209 9.8371 9.92893H9.86294Z"
        stroke={currentColor}
        stroke-width="1.13995"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
