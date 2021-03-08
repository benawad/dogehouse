import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>,
HTMLButtonElement>

export const Button: React.FC<ButtonProps
> = ({ children, ...props }) => {
  return <button className={`bg-accent p-2`} {...props}>{children}</button>;
};
