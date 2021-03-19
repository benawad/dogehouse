import React from "react";

interface DashboardGridProps {}

export const DashboardInnerGrid: React.FC<DashboardGridProps> = ({
  children,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "235px 600px 325px",
        columnGap: 60,
      }}
    >
      {children}
    </div>
  );
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({ children }) => {
  return (
    <div
      className={`flex justify-center w-full min-h-screen bg-primary-900`}
      data-testid="dashboard-grid"
    >
      <DashboardInnerGrid>{children}</DashboardInnerGrid>
    </div>
  );
};
