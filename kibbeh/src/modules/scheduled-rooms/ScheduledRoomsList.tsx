import { ScheduledRoom } from "@dogehouse/kebab";
import React, { useState } from "react";
import { useConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { FeedHeader } from "../../ui/FeedHeader";
import { MiddlePanel } from "../layouts/GridPanels";
import { CreateScheduleRoomModal } from "./CreateScheduledRoomModal";
import { EditScheduleRoomModalController } from "./EditScheduleRoomModalController";
import { ScheduledRoomCard } from "./ScheduledRoomCard";

interface ScheduledRoomsListProps {}

const Page = ({
  onLoadMore,
  cursor,
  isLastPage,
  isOnlyPage,
  getOnlyMyScheduledRooms,
  onEdit,
}: {
  onEdit: (sr: { scheduleRoomToEdit: ScheduledRoom; cursor: string }) => void;
  getOnlyMyScheduledRooms: boolean;
  cursor: string;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: string) => void;
}) => {
  const { isLoading, data } = useTypeSafeQuery(
    ["getScheduledRooms", cursor, getOnlyMyScheduledRooms],
    { staleTime: Infinity, refetchOnMount: "always" },
    [cursor, getOnlyMyScheduledRooms]
  );
  const update = useTypeSafeUpdateQuery();
  const { t } = useTypeSafeTranslation();

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && data.scheduledRooms.length === 0) {
    return (
      <div className={`mt-8 text-xl ml-4`}>
        {t("modules.scheduledRooms.noneFound")}
      </div>
    );
  }

  return (
    <div className={`${isLastPage ? "mb-24" : ""}`}>
      {data.scheduledRooms.map((r) => (
        <div className={`mt-4`} key={r.id}>
          <ScheduledRoomCard
            onDeleteComplete={() => {
              update(
                ["getScheduledRooms", cursor, getOnlyMyScheduledRooms],
                (d) => {
                  return {
                    scheduledRooms: (d?.scheduledRooms || []).filter(
                      (x) => x.id !== r.id
                    ),
                    nextCursor: d?.nextCursor,
                  };
                }
              );
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

export const ScheduledRoomsList: React.FC<ScheduledRoomsListProps> = ({}) => {
  const { t } = useTypeSafeTranslation();
  const [open, setOpen] = useState(false);
  const [{ cursors, getOnlyMyScheduledRooms }, setQueryState] = useState<{
    cursors: string[];
    getOnlyMyScheduledRooms: boolean;
  }>({ cursors: [""], getOnlyMyScheduledRooms: false });
  const update = useTypeSafeUpdateQuery();
  const conn = useConn();

  return (
    <>
      {open ? (
        <CreateScheduleRoomModal
          onScheduledRoom={(data, resp) => {
            update(["getScheduledRooms", "", getOnlyMyScheduledRooms], (d) => {
              return {
                scheduledRooms: [
                  {
                    roomId: null,
                    creator: conn.user!,
                    creatorId: conn.user!.id,
                    description: data.description,
                    id: resp.scheduledRoom.id,
                    name: data.name,
                    numAttending: 0,
                    scheduledFor: data.scheduledFor.toISOString(),
                  },
                  ...(d?.scheduledRooms || []),
                ],
                nextCursor: d?.nextCursor,
              };
            });
          }}
          onRequestClose={() => setOpen(false)}
        />
      ) : null}
      <MiddlePanel
        stickyChildren={
          <FeedHeader
            actionTitle={t("modules.scheduledRooms.scheduleRoomHeader")}
            onActionClicked={() => {
              setOpen(true);
            }}
            title={t("modules.scheduledRooms.title")}
          />
        }
      >
        <EditScheduleRoomModalController
          onScheduledRoom={(editInfo, data, _resp) => {
            update(
              ["getScheduledRooms", editInfo.cursor, getOnlyMyScheduledRooms],
              (d) => {
                return {
                  scheduledRooms: (d?.scheduledRooms || []).map((x) =>
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
              }
            );
          }}
        >
          {({ onEdit }) =>
            cursors.map((cursor, i) => (
              <Page
                getOnlyMyScheduledRooms={getOnlyMyScheduledRooms}
                onLoadMore={(o) =>
                  setQueryState({
                    cursors: [...cursors, o],
                    getOnlyMyScheduledRooms,
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
      </MiddlePanel>
    </>
  );
};
