import React from "react";

interface InfoTextProps {
  className?: string;
}

export const InfoText: React.FC<InfoTextProps> = ({ className, children }) => {
  return <div className={`text-primary-200 ${className}`}>{children}</div>;
};
