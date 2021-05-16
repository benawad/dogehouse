import React, { HTMLAttributes } from "react";

const badgeVariants = {
  "primary-700": "bg-primary-700",
  primary: "bg-primary-600",
  secondary: "bg-accent",
};

const colorVariants = {
  white: "text-primary-100",
  grey: "text-primary-300",
};

interface UserBadgeProps {
  variant?: keyof typeof badgeVariants;
  color?: keyof typeof colorVariants;
  className?: string;
  title?: string;
  naked?: boolean;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  children,
  color = "white",
  variant = "primary-700",
  className = "",
  title = "",
  naked = false,
}) => {
  return (
    <>
      {naked ? (
        <div className="mr-1 select-none" title={title}>
          {children}
        </div>
      ) : (
        <div
          title={title}
          className={`flex ${badgeVariants[variant]} select-none text-xs px-1 font-bold ${colorVariants[color]} justify-center items-center mr-1 rounded ${className}`}
          style={{ height: "16px", minWidth: "31px", width: "max-content" }}
        >
          {children}
        </div>
      )}
    </>
  );
};
