import React from "react";

interface OrderIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const OrderIcon: React.FC<OrderIconProps> = ({
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
        d="M5.42664 12.0601V13.8905C5.42664 15.6162 5.42664 16.4791 5.96275 17.0152C6.49887 17.5513 7.36173 17.5513 9.08746 17.5513H11.528C13.2537 17.5513 14.1166 17.5513 14.6527 17.0152C15.1888 16.4791 15.1888 15.6162 15.1888 13.8905V12.0601"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M5.42654 12.0096C3.69515 11.7191 2.37585 10.2133 2.37585 8.39935C2.37585 6.37753 4.01486 4.73853 6.03668 4.73853C6.28789 4.73853 6.5332 4.76383 6.77018 4.81203"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M15.3123 12.0096C17.0437 11.7191 18.363 10.2133 18.363 8.39935C18.363 6.37753 16.7239 4.73853 14.7021 4.73853C14.4509 4.73853 14.2056 4.76383 13.9686 4.81203"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M6.7623 6.87388C6.68702 6.58136 6.64697 6.27469 6.64697 5.95867C6.64697 3.93686 8.28598 2.29785 10.3078 2.29785C12.3296 2.29785 13.9686 3.93686 13.9686 5.95867C13.9686 6.27469 13.9286 6.58136 13.8533 6.87388"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M5.42664 14.8057H15.1888"
        stroke={currentColor}
        stroke-width="1.19695"
      />
      <path
        d="M10.2838 8.91333V10.8305"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M6.89343 9.07422C6.74017 9.41654 7.02114 10.7217 7.35321 10.9356"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
      <path
        d="M13.9257 9.07422C14.0789 9.41654 13.798 10.7217 13.4659 10.9356"
        stroke={currentColor}
        stroke-width="1.19695"
        stroke-linecap="round"
      />
    </svg>
  );
};

export default OrderIcon;
