import React from "react";
import { tw } from "twind";

export const RegularAnchor: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ children, ...props }) => {
  return (
    <a {...props} className={tw`text-blue-400`}>
      {children}
    </a>
  );
};
