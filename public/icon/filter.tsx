import React from "react";

interface FilterIconProps {
    color?: string;
}

const FilterIcon: React.FC<FilterIconProps> = ({
    color = "#FFFFFF",
}) => {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M5.19579 8.21135H2.16211"
                stroke={color}
                stroke-width="0.722222"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M6.54932 3.54461H9.583"
                stroke={color}
                stroke-width="0.722222"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.42357 3.51859C4.42357 2.89476 3.91408 2.38892 3.28576 2.38892C2.65743 2.38892 2.14795 2.89476 2.14795 3.51859C2.14795 4.14243 2.65743 4.64827 3.28576 4.64827C3.91408 4.64827 4.42357 4.14243 4.42357 3.51859Z"
                stroke={color}
                stroke-width="0.722222"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.85179 8.19254C9.85179 7.56871 9.3427 7.06287 8.71437 7.06287C8.08566 7.06287 7.57617 7.56871 7.57617 8.19254C7.57617 8.81638 8.08566 9.32222 8.71437 9.32222C9.3427 9.32222 9.85179 8.81638 9.85179 8.19254Z"
                stroke={color}
                stroke-width="0.722222"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    )
}

export default FilterIcon;