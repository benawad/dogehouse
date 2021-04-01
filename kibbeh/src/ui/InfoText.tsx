import React from "react";

interface InfoTextProps {
  className?: string;
}

export const InfoText: React.FC<InfoTextProps> = ({ className, children }) => {
  return <p className={`text-primary-200 ${className}`}>{children}</p>;
};
