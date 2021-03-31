import React from "react";

interface InfoTextProps {}

export const InfoText: React.FC<InfoTextProps> = ({ children }) => {
  return <p className="text-primary-200">{children}</p>;
};
