import React from "react";

interface WareOneIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const WareOneIcon: React.FC<WareOneIconProps> = ({
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
        d="M21.25 25H27.5V22.5C27.4999 21.7207 27.2571 20.9607 26.8052 20.3258C26.3533 19.6909 25.7148 19.2125 24.9784 18.9572C24.2421 18.7019 23.4445 18.6823 22.6966 18.9013C21.9486 19.1202 21.2875 19.5667 20.805 20.1787M21.25 25H8.75M21.25 25V22.5C21.25 21.68 21.0925 20.8962 20.805 20.1787M20.805 20.1787C20.3408 19.0187 19.5397 18.0243 18.505 17.3239C17.4703 16.6235 16.2495 16.2491 15 16.2491C13.7505 16.2491 12.5297 16.6235 11.495 17.3239C10.4603 18.0243 9.65919 19.0187 9.195 20.1787M8.75 25H2.5V22.5C2.50006 21.7207 2.74292 20.9607 3.19483 20.3258C3.64673 19.6909 4.28523 19.2125 5.02156 18.9572C5.75789 18.7019 6.55547 18.6823 7.30342 18.9013C8.05137 19.1202 8.71254 19.5667 9.195 20.1787M8.75 25V22.5C8.75 21.68 8.9075 20.8962 9.195 20.1787M18.75 8.75C18.75 9.74456 18.3549 10.6984 17.6517 11.4017C16.9484 12.1049 15.9946 12.5 15 12.5C14.0054 12.5 13.0516 12.1049 12.3483 11.4017C11.6451 10.6984 11.25 9.74456 11.25 8.75C11.25 7.75544 11.6451 6.80161 12.3483 6.09835C13.0516 5.39509 14.0054 5 15 5C15.9946 5 16.9484 5.39509 17.6517 6.09835C18.3549 6.80161 18.75 7.75544 18.75 8.75ZM26.25 12.5C26.25 13.163 25.9866 13.7989 25.5178 14.2678C25.0489 14.7366 24.413 15 23.75 15C23.087 15 22.4511 14.7366 21.9822 14.2678C21.5134 13.7989 21.25 13.163 21.25 12.5C21.25 11.837 21.5134 11.2011 21.9822 10.7322C22.4511 10.2634 23.087 10 23.75 10C24.413 10 25.0489 10.2634 25.5178 10.7322C25.9866 11.2011 26.25 11.837 26.25 12.5ZM8.75 12.5C8.75 13.163 8.48661 13.7989 8.01777 14.2678C7.54893 14.7366 6.91304 15 6.25 15C5.58696 15 4.95107 14.7366 4.48223 14.2678C4.01339 13.7989 3.75 13.163 3.75 12.5C3.75 11.837 4.01339 11.2011 4.48223 10.7322C4.95107 10.2634 5.58696 10 6.25 10C6.91304 10 7.54893 10.2634 8.01777 10.7322C8.48661 11.2011 8.75 11.837 8.75 12.5Z"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default WareOneIcon;
