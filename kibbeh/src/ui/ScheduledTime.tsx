import React from "react";

export const ScheduledTime: React.FC = ({ children }) => {
  return (
    <div className="text-primary-200 font-bold">
      <div className="inline-block mr-2 w-2 h-2 rounded-full bg-primary-200"></div>
      {children}
    </div>
  );
};
