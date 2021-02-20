import React from "react";
import { tw } from "twind";

interface WrapperProps {
  style?: React.CSSProperties;
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  style = { padding: "0 var(--container-paddding)", marginBottom: "auto" },
}) => {
  return (
    <div style={style}>
      {children}
      <div className={tw`mb-8`} />
    </div>
  );
};
