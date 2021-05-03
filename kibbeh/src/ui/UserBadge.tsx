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
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  children,
  color = "white",
  variant = "primary-700",
  className = "",
}) => {
  return (
    <div
      className={`flex ${badgeVariants[variant]} select-none text-xs px-1 font-bold ${colorVariants[color]} justify-center items-center mr-1 rounded ${className}`}
      style={{ height: "16px", minWidth: "31px", width: "max-content" }}
    >
      {children}
    </div>
  );
};
