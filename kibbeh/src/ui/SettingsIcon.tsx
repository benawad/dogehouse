import React, { LegacyRef, ReactElement } from "react";

export interface SettingsIconProps {
  a?: {
    href: string;
    download?: string;
    ref?: LegacyRef<HTMLAnchorElement>;
  };
  icon?: ReactElement;
  label?: string;
  trailingIcon?: ReactElement;
  classes?: string;
  transition?: boolean;
  onClick?: () => void;
}

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  a,
  icon,
  label,
  trailingIcon,
  classes = "",
  transition,
  onClick,
}) => {
  const cn = `
      flex w-full items-center px-4 py-3 md:py-2 cursor-pointer hover:bg-primary-700
      border-b md:border-none border-primary-700 ${
        transition ? `transition duration-200 ease-out` : ``
      } ${classes}`;

  if (a) {
    return (
      <a
        ref={a.ref}
        href={a.href}
        download={a.download}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cn} text-primary-100`}
      >
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cn}>
      {icon}
      <span className="flex ml-2 text-primary-100 flex-1">{label}</span>
      {trailingIcon && trailingIcon}
    </button>
  );
};
