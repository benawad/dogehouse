import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  icon?: ReactNode;
};

export const WinButton: React.FC<ButtonProps> = ({
  children,
  icon,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`flex px-2 py-1 text-xs transition
      duration-200 ease-in-out text-button
      bg-primary-700 hover:bg-primary-600 disabled:text-primary-300
       font-bold items-center justify-center focus:outline-none ${className}`}
      data-testid="button"
      {...props}
    >
      <span className={`flex items-center`}>
        {icon ? <span className={`items-center`}>{icon}</span> : null}
        {children}
      </span>
    </button>
  );
};
