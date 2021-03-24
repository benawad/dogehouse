import React from "react";

interface DashboardGridProps {
  className?: string;
}

export const MainInnerGrid: React.FC<DashboardGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "235px 640px 325px",
        columnGap: 60,
      }}
    >
      {children}
    </div>
  );
};

export const MainGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return (
    <div
      className={`flex justify-center w-full min-h-screen bg-primary-900`}
      data-testid="main-grid"
    >
      <MainInnerGrid>{children}</MainInnerGrid>
    </div>
  );
};
