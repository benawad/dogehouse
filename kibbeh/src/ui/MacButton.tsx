import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";
import { Spinner } from "./Spinner";

const sizeClassnames = {
  big: "py-2 px-6 text-sm rounded-lg",
  small: "px-2 py-1 text-xs rounded-md",
};

const colorClassnames = {
  green: "text-button green-mac-button",
  yellow: "text-button yellow-mac-button",
  red: "text-button red-mac-button",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: ReactNode;
  transition?: boolean;
};

export const MacButton: React.FC<ButtonProps> = ({
  children,
  size = "big",
  color = "green",
  disabled,
  loading,
  icon,
  className = "",
  transition,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`flex ${sizeClassnames[size]} ${
        transition ? `transition duration-200 ease-in-out` : ``
      } ${
        colorClassnames[color]
      } font-bold flex items-center justify-center ${className} rounded-full remove-outline mac-buttons`}
      data-testid="button"
      {...props}
    >
      <span className={loading ? "opacity-0" : `flex items-center`}>
        {icon ? (
          <span className={`mr-2 items-center remove-margin-right`}>
            {icon}
          </span>
        ) : null}
        {children}
      </span>
      {loading ? (
        <span className={`absolute`}>
          <Spinner size={size === "small" ? "2" : "4"} />
        </span>
      ) : null}
    </button>
  );
};
