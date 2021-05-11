import { ScheduledRoom, UserWithFollowInfo, wrap } from "@dogehouse/kebab";
import React, { useEffect, useState } from "react";
import { useConn } from "../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { ScheduledRoomCard } from "../modules/scheduled-rooms/ScheduledRoomCard";

export interface ProfileScheduledProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: UserWithFollowInfo;
}

export const ProfileScheduled: React.FC<ProfileScheduledProps> = ({
  user,
  className = "",
}) => {
  const { t } = useTypeSafeTranslation();
  const conn = useConn();
  const wrapper = wrap(conn);

  const [scheduledRooms, setScheduledRooms] = useState([]);
  useEffect(() => {
    wrapper.connection
      .sendCall("room:get_scheduled", {
        cursor: "",
        range: "all",
        userId: user.id,
      })
      .then((res: any) => {
        setScheduledRooms(res.rooms);
      });
  }, [user.id]);

  return (
    <div
      className={`mt-2 rounded-8 w-full leading-8 ${className}`}
      style={{ maxWidth: 640 }}
    >
      {scheduledRooms &&
        scheduledRooms.map((r: ScheduledRoom) => (
          <div className={`mb-4`} key={r.id}>
            <ScheduledRoomCard
              noEditOrDeleteButton={true}
              info={r}
              onEdit={() => {}}
              onDeleteComplete={() => {}}
            />
          </div>
        ))}
      {scheduledRooms.length === 0 ? (
        <span className="p-4 w-full text-base bg-primary-800 rounded-lg flex flex-col text-primary-100">
          This user has no scheduled rooms
        </span>
      ) : null}
    </div>
  );
};
