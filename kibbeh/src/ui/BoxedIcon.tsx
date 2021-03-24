import React, { ReactElement } from "react";

const colorMap = {
  "700": "bg-primary-700",
  "800": "bg-primary-800",
};

export interface BoxedIconProps
  extends React.ComponentPropsWithoutRef<"button"> {
  circle?: boolean;
  color?: keyof typeof colorMap;
}

export const BoxedIcon: React.FC<BoxedIconProps> = ({
  color = "700",
  children,
  className = "",
  circle = false,
  ...props
}) => {
  return (
    <button
      className={`${
        colorMap[color]
      } hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center ${
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
