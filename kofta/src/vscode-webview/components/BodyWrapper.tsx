import React from "react";

interface BodyWrapperProps {}

export const BodyWrapper: React.FC<BodyWrapperProps> = ({
  children
}) => {
  return (
    <div className={`px-5`}>
      {children}
    </div>
  );
};
