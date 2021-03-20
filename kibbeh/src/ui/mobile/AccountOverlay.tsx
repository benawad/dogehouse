import React, { ReactNode } from "react";

export interface AccountOverlyProps {
  children: ReactNode;
  className?: string;
}

export const AccountOverlay: React.FC<AccountOverlyProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      style={{ padding: "43px 25px" }}
      className={`w-full rounded-t-8 px-2 pt-7 pb-5 bg-primary-800 relative  ${className}`}
      data-testid="account-overlay"
    >
      <>
        <span className="absolute bg-primary-300 rounded-8 inline-block top-3 left-1 right-1 w-6 h-1 m-auto"></span>
        {children}
      </>
    </div>
  );
};
