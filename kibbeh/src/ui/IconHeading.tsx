import React, { ReactElement } from "react";

export interface IconHeadingProps {
  icon: ReactElement;
  text: string;
}

export const IconHeading: React.FC<IconHeadingProps> = ({ icon, text }) => {
  return (
    <div className="text-primary-100 font-bold leading-5">
      <span className="mr-2 align-middle">{icon}</span>
      <span>{text}</span>
    </div>
  );
};
