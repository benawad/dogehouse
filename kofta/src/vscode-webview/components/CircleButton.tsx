import React from "react";

interface CircleButtonProps {
  size?: number;
  onClick: () => void;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  size = 60,
  onClick,
  children,
}) => {
  return (
    <button
      style={{
        height: size,
        width: size,
      }}
      className={`rounded-full border border-simple-gray-80 bg-simple-gray-2b flex items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
