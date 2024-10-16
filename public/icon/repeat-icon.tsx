import React from "react";

interface RepeatIconProps {
  color?: string;
  selectedColor?: string;
  selected?: boolean;
}

const RepeatIcon: React.FC<RepeatIconProps> = ({
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
        d="M7.58431 16.9321V14.4848C7.5843 13.8647 8.08858 13.3608 8.7132 13.3569H11.0067C11.6341 13.3569 12.1427 13.8619 12.1427 14.4848V14.4848V16.925C12.1427 17.4629 12.5798 17.9 13.1216 17.9039H14.6863C15.4171 17.9058 16.1186 17.6189 16.636 17.1065C17.1534 16.5941 17.4442 15.8984 17.4442 15.1729V8.22126C17.4442 7.63519 17.1825 7.07926 16.7297 6.70325L11.4139 2.48262C10.4847 1.74439 9.15761 1.76824 8.25593 2.53937L3.05448 6.70325C2.58027 7.06818 2.29684 7.62575 2.28284 8.22126V15.1658C2.28284 16.678 3.5176 17.9039 5.04075 17.9039H6.56974C6.83058 17.9058 7.0814 17.8042 7.26651 17.6218C7.45163 17.4393 7.55574 17.191 7.55573 16.9321H7.58431Z"
        stroke={currentColor}
        stroke-width="1.19695"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.94299 9.83651C6.94299 9.50598 7.21094 9.23804 7.54147 9.23804H12.185C12.5155 9.23804 12.7835 9.50598 12.7835 9.83651C12.7835 10.167 12.5155 10.435 12.185 10.435H7.54147C7.21094 10.435 6.94299 10.167 6.94299 9.83651Z"
        fill={currentColor}
      />
    </svg>
  );
};

export default RepeatIcon;
