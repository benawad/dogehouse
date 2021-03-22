import React, { ReactElement } from "react";

export interface BoxedIconProps
  extends React.ComponentPropsWithoutRef<"button"> {
  children?: ReactElement;
  circle?: boolean;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  children,
  className = "",
  circle = false,
  ...props
}) => {
  return (
    <button
      className={`bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center ${
        circle ? `rounded-full` : `rounded`
      }
        ${className}`}
      data-testid="boxed-icon"
      {...props}
    >
      {children}
    </button>
  );
};
