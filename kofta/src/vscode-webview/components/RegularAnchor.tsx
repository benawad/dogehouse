import React from "react";

export const RegularAnchor: React.FC<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
> = ({ children, ...props }) => {
  return (
    <a style={{ color: "var(--vscode-textLink-foreground)" }} {...props}>
      {children}
    </a>
  );
};
