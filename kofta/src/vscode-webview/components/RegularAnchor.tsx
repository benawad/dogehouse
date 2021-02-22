import React from "react";

export const RegularAnchor: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ children, ...props }) => {
  return (
    <a {...props} className={`text-blue-400`}>
      {children}
    </a>
  );
};
