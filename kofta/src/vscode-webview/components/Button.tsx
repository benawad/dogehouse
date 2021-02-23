import React from "react";
import { Spinner } from "./Spinner";

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    variant?: "default" | "small" | "slim" | "follow";
    color?: "default" | "red" | "secondary";
    loading?: boolean;
  }
> = ({
  children,
  loading,
  disabled,
  color = "default",
  variant = "default",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={
        `
          rounded capitalize outline-none w-full flex items-center justify-center text-center text-white
          ${color === "secondary" ? "bg-simple-gray-3a hover:bg-simple-gray-45" : color === "red" ? "bg-red-400 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-400"}
          ${variant === "small" ? "py-1 px-2 w-max" : variant === "slim" ? "max-w-md ml-auto mr-auto py-2.5 px-12" : "py-2.5 px-1"}
          ${props.className} 
        `
      }
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
