import React from 'react';

interface DecrementIconProps {
    color?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => void;
}

const DecrementIcon: React.FC<DecrementIconProps> = ({
    color = "#7862FC",
    onClick,
}) => {
    return (
        <div onClick={onClick}>
            <svg
            width="26"
            height="27"
            viewBox="0 0 26 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
        <path
            d="M16.7554 13.5531H9.49707"
            stroke={color}
            stroke-width="1.05193"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.6855 3.82275H8.56625C5.38836 3.82275 3.396 6.07284 3.396 9.25704V17.8492C3.396 21.0334 5.37889 23.2835 8.56625 23.2835H17.6844C20.8728 23.2835 22.8568 21.0334 22.8568 17.8492V9.25704C22.8568 6.07284 20.8728 3.82275 17.6855 3.82275Z"
        stroke={color}
        stroke-width="1.05193"
        stroke-linecap="round" 
        stroke-linejoin="round"
    />
    </svg>
        </div>
    );
};

export default DecrementIcon;
