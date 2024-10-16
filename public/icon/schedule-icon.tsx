import React from "react";

interface ScheduleIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const ScheduleIcon: React.FC<ScheduleIconProps> = ({
  color = "#97A2B0",
  selectedColor = "#7862FC",
  selected = false,
}) => {
  const currentColor = selected ? selectedColor : color;
  return (
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.11932 0.924316V3.17432M15.6193 0.924316V3.17432M1.36932 16.6743V5.42432C1.36932 4.18168 2.37668 3.17432 3.61932 3.17432H17.1193C18.362 3.17432 19.3693 4.18168 19.3693 5.42432V16.6743M1.36932 16.6743C1.36932 17.917 2.37668 18.9243 3.61932 18.9243H17.1193C18.362 18.9243 19.3693 17.917 19.3693 16.6743M1.36932 16.6743V9.17432C1.36932 7.93168 2.37668 6.92432 3.61932 6.92432H17.1193C18.362 6.92432 19.3693 7.93168 19.3693 9.17432V16.6743"
        stroke={currentColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ScheduleIcon;
