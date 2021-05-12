import { ScheduledRoom, UserWithFollowInfo } from "@dogehouse/kebab";
import React, { useState } from "react";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { ScheduledRoomCard } from "../modules/scheduled-rooms/ScheduledRoomCard";
import { useTypeSafeQuery } from "../shared-hooks/useTypeSafeQuery";
import { useTypeSafeUpdateQuery } from "../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "./Button";
import { CenterLoader } from "./CenterLoader";
import { EditScheduleRoomModalController } from "../modules/scheduled-rooms/EditScheduleRoomModalController";

export interface ProfileScheduledProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: UserWithFollowInfo;
}

const List = ({
  onLoadMore,
  cursor,
  isLastPage,
  isOnlyPage,
  userId,
  onEdit,
}: {
  onEdit: (sr: { scheduleRoomToEdit: ScheduledRoom; cursor: string }) => void;
  userId: string;
  cursor: string;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: string) => void;
}) => {
  const { isLoading, data } = useTypeSafeQuery(
    ["getScheduledRooms", cursor, "all", userId],
    { staleTime: Infinity, refetchOnMount: "always" },
    [cursor, "all", userId]
  );
  const update = useTypeSafeUpdateQuery();
  const { t } = useTypeSafeTranslation();

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && data.rooms.length === 0) {
    return (
      <div
        className={`mt-2 bg-primary-800 p-4 rounded-8 w-full leading-8 text-primary-100`}
      >
        {t("modules.scheduledRooms.noneFound")}
      </div>
    );
  }

  return (
    <div className={`${isLastPage ? "mb-24" : ""}`}>
      {data.rooms.map((r) => (
        <div className={`mt-4`} key={r.id}>
          <ScheduledRoomCard
            onDeleteComplete={() => {
              update(["getScheduledRooms", cursor, "all", userId], (d) => {
                return {
                  rooms: (d?.rooms || []).filter((x) => x.id !== r.id),
                  nextCursor: d?.nextCursor,
                };
              });
            }}
            onEdit={() => onEdit({ cursor, scheduleRoomToEdit: r })}
            info={r}
          />
        </div>
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex justify-center my-4`}>
          <Button size="small" onClick={() => onLoadMore(data.nextCursor!)}>
            {t("common.loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export const ProfileScheduled: React.FC<ProfileScheduledProps> = ({
  user,
  className = "",
}) => {
  const [{ cursors, userId }, setQueryState] = useState<{
    cursors: string[];
    userId: string;
  }>({ cursors: [""], userId: user.id });
  const update = useTypeSafeUpdateQuery();

  return (
    <div
      className={`mt-2 rounded-8 w-full leading-8 ${className}`}
      style={{ maxWidth: 640 }}
    >
      <EditScheduleRoomModalController
        onScheduledRoom={(editInfo, data, _resp) => {
          update(["getScheduledRooms", editInfo.cursor, userId], (d) => {
            return {
              rooms: (d?.rooms || []).map((x) =>
                x.id === editInfo.scheduleRoomToEdit.id
                  ? {
                      ...x,
                      name: data.name,
                      description: data.description,
                      scheduledFor: data.scheduledFor.toISOString(),
                    }
                  : x
              ),
              nextCursor: d?.nextCursor,
            };
          });
        }}
      >
        {({ onEdit }) =>
          cursors.map((cursor, i) => (
            <List
              userId={userId}
              onLoadMore={(o) =>
                setQueryState({
                  cursors: [...cursors, o],
                  userId,
                })
              }
              onEdit={onEdit}
              isOnlyPage={cursors.length === 1}
              isLastPage={cursors.length - 1 === i}
              key={cursor}
              cursor={cursor}
            />
          ))
        }
      </EditScheduleRoomModalController>
    </div>
  );
};
