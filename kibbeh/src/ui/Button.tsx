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
  primary:
    "text-button bg-accent hover:bg-accent-hover disabled:text-accent-disabled disabled:bg-accent-hover",
  secondary:
    "text-button bg-primary-700 hover:bg-primary-600 disabled:text-primary-300",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: keyof typeof sizeClassnames;
  color?: keyof typeof colorClassnames;
  loading?: boolean;
  icon?: ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "big",
  color = "primary",
  disabled,
  loading,
  icon,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`${sizeClassnames[size]} ${colorClassnames[color]} font-bold flex items-center justify-center`}
      {...props}
    >
      <span className={loading ? "opacity-0" : `flex items-center`}>
        {icon ? <span className={`mr-2 items-center`}>{icon}</span> : null}
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
