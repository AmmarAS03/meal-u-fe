import React from "react";

interface OrderIconProps {
    color?: string;
    width?: number;
    height?: number;
}

const OrdersIcon: React.FC<OrderIconProps> = ({
    color = "white",
    width = 20,
    height = 26
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6.25 4.25H3.75C3.08696 4.25 2.45107 4.51339 1.98223 4.98223C1.51339 5.45107 1.25 6.08696 1.25 6.75V21.75C1.25 22.413 1.51339 23.0489 1.98223 23.5178C2.45107 23.9866 3.08696 24.25 3.75 24.25H16.25C16.913 24.25 17.5489 23.9866 18.0178 23.5178C18.4866 23.0489 18.75 22.413 18.75 21.75V6.75C18.75 6.08696 18.4866 5.45107 18.0178 4.98223C17.5489 4.51339 16.913 4.25 16.25 4.25H13.75M6.25 4.25C6.25 4.91304 6.51339 5.54893 6.98223 6.01777C7.45107 6.48661 8.08696 6.75 8.75 6.75H11.25C11.913 6.75 12.5489 6.48661 13.0178 6.01777C13.4866 5.54893 13.75 4.91304 13.75 4.25M6.25 4.25C6.25 3.58696 6.51339 2.95107 6.98223 2.48223C7.45107 2.01339 8.08696 1.75 8.75 1.75H11.25C11.913 1.75 12.5489 2.01339 13.0178 2.48223C13.4866 2.95107 13.75 3.58696 13.75 4.25M10 13H13.75M10 18H13.75M6.25 13H6.2625M6.25 18H6.2625"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default OrdersIcon;