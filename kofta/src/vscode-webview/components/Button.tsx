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
  style,
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
      style={{
        color:
          color === "secondary"
            ? "var(--vscode-button-secondaryForeground)"
            : "var(--vscode-button-foreground)",
        padding: `10px var(--input-padding-horizontal)`,
        fontSize: `var(--vscode-font-size)`,
        backgroundColor: `var(--vscode-button-background)`,
        ...(variant === "small" ? { padding: "4px 8px", width: "unset" } : (variant === "slim" ? { marginLeft: "auto", marginRight: "auto", padding: "10px 48px" } : {}) ),
        ...style,
      }}
      className={
        tw`
          rounded capitalize outline-none w-full flex items-center justify-center text-center 
          ${variant === "slim" ? "max-w-md" : ""} 
          ${props.className}
        `
      }
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
