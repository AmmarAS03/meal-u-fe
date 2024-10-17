import React from 'react';

interface IncrementIconProps {
    color?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => void;
}

const IncrementIcon: React.FC<IncrementIconProps> = ({
    color = "#7862FC",
    onClick,
}) => {
    return (
        <div onClick={onClick}>
        <svg
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
            d="M17.1451 13.5535H9.88672"
            stroke={color}
            stroke-width="1.05193"
            stroke-linecap="round"
            stroke-linejoin="round"
            />
            <path
                d="M13.5175 17.1825V9.92419"
                stroke={color}
                stroke-width="1.05193"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.0756 3.82312H8.95638C5.77849 3.82312 3.78613 6.07321 3.78613 9.25741V17.8496C3.78613 21.0338 5.76903 23.2839 8.95638 23.2839H18.0745C21.263 23.2839 23.2469 21.0338 23.2469 17.8496V9.25741C23.2469 6.07321 21.263 3.82312 18.0756 3.82312Z"
                stroke={color}
                stroke-width="1.05193"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        </div>
    );
};

export default IncrementIcon;
