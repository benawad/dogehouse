import isElectron from "is-electron";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { isServer } from "../../lib/isServer";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { Feed, FeedHeader } from "../../ui/Feed";
import { RoomCard } from "../../ui/RoomCard";
import { MiddlePanel } from "../layouts/GridPanels";
import { useRoomChatStore } from "../room/chat/useRoomChatStore";
import { EditScheduleRoomModalController } from "../scheduled-rooms/EditScheduleRoomModalController";
import { ScheduledRoomCard } from "../scheduled-rooms/ScheduledRoomCard";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { CreateRoomModal } from "./CreateRoomModal";

interface FeedControllerProps { }

const Page = ({
  cursor,
  isLastPage,
  onLoadMore,
}: {
  cursor: number;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: number) => void;
}) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  const { t } = useTypeSafeTranslation();
  const { isLoading, data } = useTypeSafeQuery(
    ["getTopPublicRooms", cursor],
    {
      staleTime: Infinity,
      enabled: !isServer,
      refetchOnMount: "always",
      refetchInterval: 10000,
    },
    [cursor]
  );
  useEffect(() => {
    if (isElectron()) {
      const ipcRenderer = window.require("electron").ipcRenderer;
      ipcRenderer.send("@rpc/page", { page: "home", opened: true, modal: false, data: data?.rooms.length });

      return () => {
        ipcRenderer.send("@rpc/page", { page: "home", opened: false, modal: false, data: data?.rooms.length });
      }
    }
  }, [data]);

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return null;
  }

  // if (isOnlyPage && data.rooms.length === 0) {
  //   return (
  //     <Button variant="small" onClick={() => refetch()}>
  //       {t("pages.home.refresh")}
  //     </Button>
  //   );
  // }

  return (
    <>
      {data.rooms.map((room) => (
        <RoomCard
          onClick={() => {
            if (room.id !== currentRoomId) {
              useRoomChatStore.getState().reset();
              prefetch(["joinRoomAndGetInfo", room.id], [room.id]);
            }

            push(`/room/[id]`, `/room/${room.id}`);
          }}
          key={room.id}
          title={room.name}
          subtitle={
            "peoplePreviewList" in room
              ? room.peoplePreviewList
                .slice(0, 3)
                .map((x) => x.displayName)
                .join(", ")
              : ""
          }
          listeners={"numPeopleInside" in room ? room.numPeopleInside : 0}
          tags={[]}
        />
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex justify-center py-5`}>
          <Button
            size="small"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            {t("common.loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

// const isMac = process.platform === "darwin";

export const FeedController: React.FC<FeedControllerProps> = ({ }) => {
  const [cursors, setCursors] = useState([0]);
  const { conn } = useContext(WebSocketContext);
  const [roomModal, setRoomModal] = useState(false);
  const { data } = useTypeSafeQuery("getMyScheduledRoomsAboutToStart", {
    enabled: !!conn,
    refetchOnMount: "always",
  });
  const updater = useTypeSafeUpdateQuery();

  // useEffect(() => {
  //   if (isElectron() && isMac) {
  //     modalAlert(t("common.requestPermissions"));
  //   }
  // }, [t]);

  if (!conn) {
    return null;
  }

  return (
    <MiddlePanel
      stickyChildren={
        <FeedHeader
          actionTitle="New room"
          onActionClicked={() => {
            setRoomModal(true);
          }}
          title="Your Feed"
        />
      }
    >
      <div className="flex-1 flex-col mb-7" data-testid="feed">
        <div className="flex-col space-y-4">
          {data?.scheduledRooms?.map((sr) => (
            <EditScheduleRoomModalController
              key={sr.id}
              onScheduledRoom={(_, editedRoomData) => {
                updater("getMyScheduledRoomsAboutToStart", (x) => {
                  return !x
                    ? x
                    : {
                      scheduledRooms: x.scheduledRooms.map((y) =>
                        y.id === sr.id
                          ? {
                            ...sr,
                            name: editedRoomData.name,
                            description: editedRoomData.description,
                            scheduledFor: editedRoomData.scheduledFor.toISOString(),
                          }
                          : y
                      ),
                    };
                });
              }}
            >
              {({ onEdit }) => (
                <ScheduledRoomCard
                  info={sr}
                  onDeleteComplete={() =>
                    updater("getMyScheduledRoomsAboutToStart", (x) =>
                      !x
                        ? x
                        : {
                          scheduledRooms: x.scheduledRooms.filter(
                            (y) => y.id !== sr.id
                          ),
                        }
                    )
                  }
                  onEdit={() => onEdit({ cursor: "", scheduleRoomToEdit: sr })}
                  noCopyLinkButton
                />
              )}
            </EditScheduleRoomModalController>
          ))}
          {cursors.map((cursor, i) => (
            <Page
              key={cursor}
              cursor={cursor}
              isOnlyPage={cursors.length === 1}
              onLoadMore={(c) => setCursors([...cursors, c])}
              isLastPage={i === cursors.length - 1}
            />
          ))}
        </div>
      </div>
      {roomModal && (
        <CreateRoomModal onRequestClose={() => setRoomModal(false)} />
      )}
    </MiddlePanel>
  );
};
