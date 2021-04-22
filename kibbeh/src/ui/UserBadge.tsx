import React, { HTMLAttributes } from "react";

const badgeVariants = {
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
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  children,
  color = "white",
  variant = "primary",
}) => {
  return (
    <div
      className={`flex ${badgeVariants[variant]} select-none text-xs px-1 font-bold ${colorVariants[color]} justify-center items-center mr-1 rounded`}
      style={{ minWidth: "31px", height: "16px" }}
    >
      {children}
    </div>
  );
};
