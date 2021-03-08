// React
import React from "react";

type Variants = "primary" | "secondary";

interface UserBadgeProps {
  variant?: Variants;
}

const badgeVariants = {
  primary: "bg-primary-600",
  secondary: "bg-accent",
};

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
