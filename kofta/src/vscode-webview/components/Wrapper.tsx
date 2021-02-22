import React from "react";
import { tw } from "twind";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({
  children
}) => {
  return (
    <div className={tw`mb-auto`}>
      {children}
      <div className={tw`mb-8`} />
    </div>
  );
};
