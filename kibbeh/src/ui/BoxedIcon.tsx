// React
import React, { HTMLAttributes } from "react";

export const BoxedIcon: React.FC<HTMLAttributes<HTMLElement>> = ({
  children,
  ...props
}) => {
  return (
    <div
      className="bg-primary-700 text-primary-100 justify-center items-center rounded"
      style={{ height: "40px", width: "40px" }}
      {...props}
    >
      {children}
    </div>
  );
};
