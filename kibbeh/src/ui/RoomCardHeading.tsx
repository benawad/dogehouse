import React, { ReactElement } from "react";

export interface RoomCardHeadingProps {
  icon?: ReactElement;
  text: string;
}

export const RoomCardHeading: React.FC<RoomCardHeadingProps> = ({
  icon,
  text,
}) => {
  return (
    <div className="flex text-primary-100 font-bold leading-5 truncate w-full">
      {icon ? <span className="mr-2 align-middle">{icon}</span> : null}
      <span className="inline truncate">{text}</span>
    </div>
  );
};
