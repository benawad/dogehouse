import React from "react";
import { tw } from "twind";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({
  children
}) => {
  return (
    <div style={{ marginBottom: "auto" }}>
      {children}
      <div className={tw`mb-8`} />
    </div>
  );
};
