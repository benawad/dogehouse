import React from "react";

interface CircleButtonProps {
  size?: number;
  onClick: () => void;
  title?: string;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  size = 60,
  title,
  onClick,
  children,
}) => {
  return (
    <button
      style={{
        height: size,
        width: size,
      }}
      title={title}
      className={`rounded-full border border-simple-gray-80 bg-simple-gray-2b flex items-center justify-center`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
