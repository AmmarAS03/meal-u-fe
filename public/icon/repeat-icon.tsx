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
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill={selected ? selectedColor : color}
    >
      <path
        d="M6.43876 17.0893V14.5246C6.43874 13.8746 6.96723 13.3466 7.62183 13.3425H10.0254C10.6829 13.3425 11.216 13.8717 11.216 14.5246V14.5246V17.0818C11.216 17.6455 11.674 18.1036 12.2418 18.1077H13.8816C14.6475 18.1097 15.3827 17.809 15.9249 17.2721C16.4672 16.7351 16.7719 16.006 16.7719 15.2456V7.96034C16.7719 7.34614 16.4977 6.76353 16.0231 6.36947L10.4522 1.94625C9.47841 1.17258 8.08758 1.19758 7.14261 2.00573L1.69149 6.36947C1.19452 6.75192 0.897491 7.33625 0.882812 7.96034V15.2382C0.882813 16.823 2.17684 18.1077 3.7731 18.1077H5.37549C5.64885 18.1097 5.9117 18.0033 6.10571 17.8121C6.29971 17.6209 6.40881 17.3607 6.40881 17.0893H6.43876Z"
        stroke="#97A2B0"
        stroke-width="1.2544"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.76672 9.65302C5.76672 9.30663 6.04753 9.02582 6.39392 9.02582H11.2603C11.6067 9.02582 11.8875 9.30663 11.8875 9.65302C11.8875 9.99941 11.6067 10.2802 11.2603 10.2802H6.39392C6.04753 10.2802 5.76672 9.99941 5.76672 9.65302Z"
        fill={selected ? color : selectedColor}
      />
    </svg>
  );
};

export default RepeatIcon;
