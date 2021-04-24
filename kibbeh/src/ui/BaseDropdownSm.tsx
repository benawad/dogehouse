import React from "react";

type BaseDropdownSmItemProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNode;
};

export const BaseDropdownSmItem: React.FC<BaseDropdownSmItemProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`px-3 py-1 cursor-pointer hover:bg-primary-700 ${className}`}
    {...props}
  >
    {children}
  </div>
);

type BaseDropdownSmProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  children: React.ReactNodeArray;
};

export const BaseDropdownSm: React.FC<BaseDropdownSmProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`text-primary-100 bg-primary-800
    border border-primary-700 rounded-md
    py-2 shadow-lg inline-flex flex-col gap-y-1 ${className}`}
    {...props}
  >
    {children}
  </div>
);
