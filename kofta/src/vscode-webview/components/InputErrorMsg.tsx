import React from "react";

interface InputErrorMsgProps {}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={`text-red-600`}>{children}</div>;
};
