import React from "react";

interface LockIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const LockIcon: React.FC<LockIconProps> = ({
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
        d="M15.2295 8.35497V6.47279C15.2295 4.26975 13.4429 2.48312 11.2398 2.48312C9.0368 2.47348 7.24316 4.25134 7.23352 6.45526V6.47279V8.35497"
        stroke="#0A2533"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5807 18.7011H7.88214C6.04642 18.7011 4.55786 17.2134 4.55786 15.3768V11.6168C4.55786 9.78024 6.04642 8.29255 7.88214 8.29255H14.5807C16.4164 8.29255 17.905 9.78024 17.905 11.6168V15.3768C17.905 17.2134 16.4164 18.7011 14.5807 18.7011Z"
        stroke="#0A2533"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.2315 12.5234V14.4704"
        stroke="#0A2533"
        stroke-width="1.57798"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default LockIcon;
