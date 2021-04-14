import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
} from "react";

const colorClassnames = {
  green: "text-button green-mac-button",
  yellow: "text-button yellow-mac-button",
  red: "text-button red-mac-button",
};

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  color?: keyof typeof colorClassnames;
  icon?: ReactNode;
};

export const MacButton: React.FC<ButtonProps> = ({
  children,
  color = "green",
  icon,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`flex px-2 py-1 text-xs rounded-md transition duration-200 ease-in-out ${colorClassnames[color]} font-bold flex items-center justify-center ${className} rounded-full remove-outline mac-buttons`}
      data-testid="button"
      {...props}
    >
      <span className="flex items-center">
        {icon ? <span className={`items-center`}>{icon}</span> : null}
        {children}
      </span>
    </button>
  );
};
