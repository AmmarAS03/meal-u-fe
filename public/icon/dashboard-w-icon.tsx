import React from "react";

interface DashboardWareIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const DashboardWareIcon: React.FC<DashboardWareIconProps> = ({
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
        d="M11.25 6.25H8.75C8.08696 6.25 7.45107 6.51339 6.98223 6.98223C6.51339 7.45107 6.25 8.08696 6.25 8.75V23.75C6.25 24.413 6.51339 25.0489 6.98223 25.5178C7.45107 25.9866 8.08696 26.25 8.75 26.25H21.25C21.913 26.25 22.5489 25.9866 23.0178 25.5178C23.4866 25.0489 23.75 24.413 23.75 23.75V8.75C23.75 8.08696 23.4866 7.45107 23.0178 6.98223C22.5489 6.51339 21.913 6.25 21.25 6.25H18.75M11.25 6.25C11.25 6.91304 11.5134 7.54893 11.9822 8.01777C12.4511 8.48661 13.087 8.75 13.75 8.75H16.25C16.913 8.75 17.5489 8.48661 18.0178 8.01777C18.4866 7.54893 18.75 6.91304 18.75 6.25M11.25 6.25C11.25 5.58696 11.5134 4.95107 11.9822 4.48223C12.4511 4.01339 13.087 3.75 13.75 3.75H16.25C16.913 3.75 17.5489 4.01339 18.0178 4.48223C18.4866 4.95107 18.75 5.58696 18.75 6.25M15 15H18.75M15 20H18.75M11.25 15H11.2625M11.25 20H11.2625"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DashboardWareIcon;
