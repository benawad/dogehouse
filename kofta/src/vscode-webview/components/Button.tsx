import React from "react";
import { tw } from "twind";
import { Spinner } from "./Spinner";

const colorToBackground = {
  red: "bg-buttonRed hover:bg-buttonHoverRed",
  secondary: "bg-buttonSecondary hover:bg-buttonHoverSecondary",
};

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    variant?: "default" | "small" | "follow";
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
      disabled={loading || disabled}
      style={{
        borderRadius: 4,
        outline: "1px solid transparent",
        outlineOffset: 2,
        color:
          color === "secondary"
            ? "var(--vscode-button-secondaryForeground)"
            : "var(--vscode-button-foreground)",
        padding: `10px var(--input-padding-horizontal)`,
        fontSize: `var(--vscode-font-size)`,
        textTransform: "capitalize",
        ...(variant === "small" ? { padding: "4px 8px", width: "unset" } : {}),
        ...style,
      }}
      className={tw`w-full flex items-center justify-center text-center ${
        colorToBackground[color as keyof typeof colorToBackground] ||
        "bg-button hover:bg-buttonHover"
      } `}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
