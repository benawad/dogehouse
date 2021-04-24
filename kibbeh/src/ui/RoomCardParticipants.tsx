import React from "react";
import { MultipleUsers } from "./UserAvatar/MultipleUsers";

export interface RoomCardParticipantsProps {
  users: { name: string; picture: string }[];
  className?: string;
}

export const RoomCardParticipants: React.FC<RoomCardParticipantsProps> = ({
  users,
  className,
  ...props
}) => {
  const pics = users.map((u) => u.picture);
  const names = users.map((u) => u.name).join(", ");

  return (
    <div className={`flex space-x-1 ${className ? className : ""}`} {...props}>
      <MultipleUsers srcArray={pics} />
      <div className={`flex table-cell`}>
        <p
          className={`text-primary-300 truncate`}
          style={{ fontSize: "0.9rem" }}
        >
          {names}
        </p>
      </div>
    </div>
  );
};
