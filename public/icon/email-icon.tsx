import React from "react";

interface EmailIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const EmailIcon: React.FC<EmailIconProps> = ({
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
      <path
        d="M16.5262 8.26073L12.631 11.4281C11.8951 12.012 10.8596 12.012 10.1237 11.4281L6.19556 8.26073"
        stroke="#0A2533"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.655 18.9111C18.3213 18.9184 20.1182 16.7278 20.1182 14.0355V8.01427C20.1182 5.3219 18.3213 3.13129 15.655 3.13129H7.04826C4.38204 3.13129 2.58508 5.3219 2.58508 8.01427V14.0355C2.58508 16.7278 4.38204 18.9184 7.04826 18.9111H15.655Z"
        stroke="#0A2533"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default EmailIcon;
