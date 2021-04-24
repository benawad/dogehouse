import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";
import { Spinner } from "./Spinner";

const colorClassnames = {
  primary:
    "text-button bg-accent hover:bg-accent-hover disabled:text-accent-disabled disabled:bg-accent-hover",
  secondary:
    "text-button bg-primary-700 hover:bg-primary-600 disabled:text-primary-300",
  "secondary-800":
    "text-button bg-primary-800 hover:bg-primary-600 disabled:text-primary-300",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
  icon?: ReactNode;
};

export const BannerButton: React.FC<ButtonProps> = ({
  children,
  icon,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`flex outline-none focus:ring-4 px-2 py-1 text-sm rounded-md 
      transition duration-200 ease-in-out
      text-button bg-transparent font-bold items-center justify-center ${className} banner-btn`}
      data-testid="button"
      {...props}
    >
      <span className={`flex items-center`}>
        {icon ? <span className={`mr-2 items-center`}>{icon}</span> : null}
        {children}
      </span>
    </button>
  );
};
