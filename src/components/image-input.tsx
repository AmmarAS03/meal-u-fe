import React from 'react';

interface ImageInputProps {
    bgColor?: string;
    color?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({
    bgColor = "#E6EBF2",
    color = "#7862FC",
    onClick,
}) => {
    return (
        <div onClick={onClick}>
            <svg width="340" height="292" viewBox="0 0 340 292" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="340" height="291.552" rx="11" fill="#E6EBF2"/>
                <path d="M157.333 153.333L165.741 144.926C166.429 144.238 167.361 143.852 168.333 143.852C169.306 143.852 170.238 144.238 170.926 144.926L179.333 153.333M175.667 149.667L178.574 146.759C179.262 146.072 180.195 145.685 181.167 145.685C182.139 145.685 183.072 146.072 183.759 146.759L186.667 149.667M175.667 138.667H175.685M161 160.667H183C183.973 160.667 184.905 160.28 185.593 159.593C186.281 158.905 186.667 157.973 186.667 157V135C186.667 134.028 186.281 133.095 185.593 132.407C184.905 131.72 183.973 131.333 183 131.333H161C160.028 131.333 159.095 131.72 158.407 132.407C157.72 133.095 157.333 134.028 157.333 135V157C157.333 157.973 157.72 158.905 158.407 159.593C159.095 160.28 160.028 160.667 161 160.667Z" stroke="#97A2B0" stroke-width="3.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    );
};

export default ImageInput;