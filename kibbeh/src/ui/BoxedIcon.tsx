// React
import React, { HTMLAttributes } from "react";

export const BoxedIcon: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return (
    <div
      className="bg-primary-700 hover:bg-primary-600 h-6 w-6 cursor-pointer text-primary-100 justify-center items-center rounded"
      {...props}
    >
      {children}
    </div>
  );
};
