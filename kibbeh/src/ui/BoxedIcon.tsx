import React, { ReactElement } from "react";

export interface BoxedIconProps {
  className?: string;
  children?: ReactElement;
  iscircular?: boolean;
  onClick?: () => void;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  children,
  onClick,
  className = "",
  iscircular = false,
}) => {
  return (
    <button onClick={onClick}>
      {iscircular ? (
        <div
          className={`bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center rounded-full
        ${className}`}
          data-testid="boxed-icon"
        >
          {children}
        </div>
      ) : (
        <div
          className={`bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center rounded
        ${className}`}
          data-testid="boxed-icon"
        >
          {children}
        </div>
      )}
    </button>
  );
};
