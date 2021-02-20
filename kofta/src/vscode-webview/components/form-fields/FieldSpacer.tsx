import React from "react";
import { tw } from "twind";

interface FieldSpacerProps {}

export const FieldSpacer: React.FC<FieldSpacerProps> = ({}) => {
  return <div className={tw`my-6`} />;
};
