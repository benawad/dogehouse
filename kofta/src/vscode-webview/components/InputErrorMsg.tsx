import React from "react";
import { tw } from "twind";

interface InputErrorMsgProps {}

export const InputErrorMsg: React.FC<InputErrorMsgProps> = ({ children }) => {
  return <div className={tw`text-error`}>{children}</div>;
};
