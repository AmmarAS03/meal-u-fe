import React from "react";

interface WareTwoIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const WareTwoIcon: React.FC<WareTwoIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="32"
      viewBox="0 0 30 32"
      fill="none"
    >
      <path
        d="M7.5 5.15039C6.70435 5.15039 5.94129 5.477 5.37868 6.05836C4.81607 6.63972 4.5 7.42822 4.5 8.25039V11.3504C4.5 12.1726 4.81607 12.9611 5.37868 13.5424C5.94129 14.1238 6.70435 14.4504 7.5 14.4504H10.5C11.2956 14.4504 12.0587 14.1238 12.6213 13.5424C13.1839 12.9611 13.5 12.1726 13.5 11.3504V8.25039C13.5 7.42822 13.1839 6.63972 12.6213 6.05836C12.0587 5.477 11.2956 5.15039 10.5 5.15039H7.5ZM7.5 17.5504C6.70435 17.5504 5.94129 17.877 5.37868 18.4584C4.81607 19.0397 4.5 19.8282 4.5 20.6504V23.7504C4.5 24.5726 4.81607 25.3611 5.37868 25.9424C5.94129 26.5238 6.70435 26.8504 7.5 26.8504H10.5C11.2956 26.8504 12.0587 26.5238 12.6213 25.9424C13.1839 25.3611 13.5 24.5726 13.5 23.7504V20.6504C13.5 19.8282 13.1839 19.0397 12.6213 18.4584C12.0587 17.877 11.2956 17.5504 10.5 17.5504H7.5ZM16.5 8.25039C16.5 7.42822 16.8161 6.63972 17.3787 6.05836C17.9413 5.477 18.7044 5.15039 19.5 5.15039H22.5C23.2956 5.15039 24.0587 5.477 24.6213 6.05836C25.1839 6.63972 25.5 7.42822 25.5 8.25039V11.3504C25.5 12.1726 25.1839 12.9611 24.6213 13.5424C24.0587 14.1238 23.2956 14.4504 22.5 14.4504H19.5C18.7044 14.4504 17.9413 14.1238 17.3787 13.5424C16.8161 12.9611 16.5 12.1726 16.5 11.3504V8.25039ZM16.5 20.6504C16.5 19.8282 16.8161 19.0397 17.3787 18.4584C17.9413 17.877 18.7044 17.5504 19.5 17.5504H22.5C23.2956 17.5504 24.0587 17.877 24.6213 18.4584C25.1839 19.0397 25.5 19.8282 25.5 20.6504V23.7504C25.5 24.5726 25.1839 25.3611 24.6213 25.9424C24.0587 26.5238 23.2956 26.8504 22.5 26.8504H19.5C18.7044 26.8504 17.9413 26.5238 17.3787 25.9424C16.8161 25.3611 16.5 24.5726 16.5 23.7504V20.6504Z"
        fill="white"
      />
    </svg>
  );
};

export default WareTwoIcon;
