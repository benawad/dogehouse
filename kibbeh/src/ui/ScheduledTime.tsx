import React from "react";

export const ScheduledTime: React.FC<{ active?: boolean }> = ({
  active,
  children,
}) => {
  return (
    <div className="text-primary-200 font-bold items-center">
      <div
        className={`inline-block mr-2 w-2 h-2 rounded-full ${
          active ? "bg-accent" : "bg-primary-300"
        }`}
      ></div>
      {children}
    </div>
  );
};
