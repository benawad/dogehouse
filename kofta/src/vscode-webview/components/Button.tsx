import React from "react";
import { tw } from "twind";
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
        tw`
          rounded capitalize outline-none w-full flex items-center justify-center text-center text-gray-50 py-1.5 px-1 bg-blue-500
          ${variant === "small" ? "py-1 px-2 w-max" : variant === "slim" ? "max-w-md ml-auto mr-auto py-2.5 px-12" : ""}
          ${props.className} 
        `
      }
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
