import React from "react";

interface InputErrorMsgProps {}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`text-error`}>{children}</div>;
};
