import React from "react";

interface BodyWrapperProps {}

export const BodyWrapper: React.FC<BodyWrapperProps> = ({
  children
}) => {
  return (
    <div style={{ padding: "0 var(--container-paddding)" }}>
      {children}
    </div>
  );
};
