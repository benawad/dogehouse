import React from "react";

const badgeVariants = {
  primary: "bg-primary-600",
  secondary: "bg-accent",
};

interface UserBadgeProps {
  variant?: keyof typeof badgeVariants;
}

export const UserBadge: React.FC<UserBadgeProps> = ({
  children,
  variant = "primary",
}) => {
  return (
    <div
      className={`${badgeVariants[variant]} select-none text-xs px-1 font-bold text-primary-100 justify-center items-center rounded`}
      style={{ minWidth: "31px", height: "16px" }}
    >
      {children}
    </div>
  );
};
