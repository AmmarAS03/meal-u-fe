import React from 'react';

interface IconButtonProps {
  icon?: React.ReactNode;
  text: string;
  textColor: string;
  backgroundColor: string;
  hoverColor?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  width?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  textColor,
  backgroundColor,
  hoverColor,
  onClick,
  width = '100%'
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: width,
        padding: '10px',
        backgroundColor: backgroundColor,
        color: textColor,
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={(e) => {
        if (hoverColor) {
          e.currentTarget.style.backgroundColor = hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = backgroundColor;
      }}
    >
      {icon && <span style={{ marginRight: '10px' }}>{icon}</span>}
      {text}
    </button>
  );
};

export default IconButton;