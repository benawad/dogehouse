import React from "react";

interface NativeSelectProps {}

export const NativeSelect: React.FC<
  React.ComponentPropsWithoutRef<"select">
> = ({ children, className, ...props }) => {
  return (
    <select
      className={`h-full bg-primary-700 text-primary-100 placeholder-primary-300 focus:outline-none rounded-8 px-2 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
