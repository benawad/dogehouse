import { useAtom } from "jotai";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { wsFetch } from "../../../createWebsocket";
import { useSocketStatus } from "../../../webrtc/stores/useSocketStatus";
import { meAtom } from "../../atoms";
import { Backbar } from "../../components/Backbar";
import { BodyWrapper } from "../../components/BodyWrapper";
import { BottomVoiceControl } from "../../components/BottomVoiceControl";
import { Button } from "../../components/Button";
import { ProfileButton } from "../../components/ProfileButton";
import { Spinner } from "../../components/Spinner";
import { Wrapper } from "../../components/Wrapper";
import { ScheduledRoom, ScheduledRoomsInfo } from "../../types";
import { ScheduledRoomCard } from "./ScheduledRoomCard";
import { ScheduleRoomModal } from "./ScheduleRoomModal";

interface ScheduledRoomsPageProps {}

export const GET_SCHEDULED_ROOMS = "get_scheduled_rooms";

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
  const queryClient = useQueryClient();
  const { status } = useSocketStatus();
  const { isLoading, data } = useQuery<ScheduledRoomsInfo>(
    [GET_SCHEDULED_ROOMS, cursor, getOnlyMyScheduledRooms],
    () =>
      wsFetch<any>({
        op: GET_SCHEDULED_ROOMS,
        d: { cursor, getOnlyMyScheduledRooms },
      }),
    { staleTime: Infinity, enabled: status === "auth-good" }
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && data.scheduledRooms.length === 0) {
    return <div className={`mt-8 text-xl ml-4`}>none found</div>;
  }

  return (
    <>
      {data.scheduledRooms.map((r) => (
        <div className={`mt-4`} key={r.id}>
          <ScheduledRoomCard
            onDeleteComplete={() => {
              queryClient.setQueryData<ScheduledRoomsInfo>(
                [GET_SCHEDULED_ROOMS, cursor, getOnlyMyScheduledRooms],
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
        <div className={`flex justify-center my-10`}>
          <Button variant="small" onClick={() => onLoadMore(data.nextCursor!)}>
            load more
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const ScheduledRoomsPage: React.FC<ScheduledRoomsPageProps> = ({}) => {
  const queryClient = useQueryClient();
  const [showScheduleRoomModal, setShowScheduleRoomModal] = useState(false);
  const [{ cursors, getOnlyMyScheduledRooms }, setQueryState] = useState<{
    cursors: string[];
    getOnlyMyScheduledRooms: boolean;
  }>({ cursors: [""], getOnlyMyScheduledRooms: false });
  const [editInfo, setScheduleRoomToEdit] = useState<{
    scheduleRoomToEdit: ScheduledRoom;
    cursor: string;
  } | null>(null);
  const [me] = useAtom(meAtom);

  return (
    <div className={`flex flex-col flex-1`}>
      <Wrapper>
        <BodyWrapper>
          <Backbar>
            <h1
              className={`font-xl flex-1 text-center flex items-center justify-center text-2xl`}
            >
              Scheduled Rooms
            </h1>
            <ProfileButton />
          </Backbar>
          <select
            onChange={(e) => {
              const newGetOnlyMyScheduledRooms = e.target.value === "true";
              if (newGetOnlyMyScheduledRooms === getOnlyMyScheduledRooms) {
                return;
              }
              queryClient.prefetchQuery(
                [GET_SCHEDULED_ROOMS, "", newGetOnlyMyScheduledRooms],
                () =>
                  wsFetch({
                    op: GET_SCHEDULED_ROOMS,
                    d: {
                      cursor: "",
                      getOnlyMyScheduledRooms: newGetOnlyMyScheduledRooms,
                    },
                  }),
                { staleTime: 0 }
              );
              setQueryState({
                cursors: [""],
                getOnlyMyScheduledRooms: newGetOnlyMyScheduledRooms,
              });
            }}
            value={"" + getOnlyMyScheduledRooms}
          >
            <option value="false">all scheduled rooms</option>
            <option value="true">my scheduled rooms</option>
          </select>
          {cursors.map((cursor, i) => (
            <Page
              getOnlyMyScheduledRooms={getOnlyMyScheduledRooms}
              onLoadMore={(o) =>
                setQueryState({
                  cursors: [...cursors, o],
                  getOnlyMyScheduledRooms,
                })
              }
              onEdit={setScheduleRoomToEdit}
              isOnlyPage={cursors.length === 1}
              isLastPage={cursors.length - 1 === i}
              key={cursor}
              cursor={cursor}
            />
          ))}
          <div style={{ height: 40 }} />
        </BodyWrapper>
      </Wrapper>
      <BottomVoiceControl>
        <div className={`mb-8 flex px-5`}>
          <Button
            variant="slim"
            dogeProbability={0.01}
            onClick={() => {
              setShowScheduleRoomModal(true);
            }}
          >
            <h3 className={`text-2xl`}>Schedule Room</h3>
          </Button>
        </div>
      </BottomVoiceControl>
      {showScheduleRoomModal ? (
        <ScheduleRoomModal
          onScheduledRoom={(data, resp) => {
            queryClient.setQueryData<ScheduledRoomsInfo>(
              [GET_SCHEDULED_ROOMS, "", getOnlyMyScheduledRooms],
              (d) => {
                return {
                  scheduledRooms: [
                    {
                      creator: me!,
                      creatorId: me!.id,
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
              }
            );
          }}
          onRequestClose={() => setShowScheduleRoomModal(false)}
        />
      ) : null}
      {editInfo ? (
        <ScheduleRoomModal
          editInfo={{
            id: editInfo.scheduleRoomToEdit.id,
            intialValues: {
              cohosts: [],
              description: editInfo.scheduleRoomToEdit.description,
              name: editInfo.scheduleRoomToEdit.name,
              scheduledFor: new Date(editInfo.scheduleRoomToEdit.scheduledFor),
            },
          }}
          onScheduledRoom={(data, _resp) => {
            queryClient.setQueryData<ScheduledRoomsInfo>(
              [GET_SCHEDULED_ROOMS, editInfo.cursor, getOnlyMyScheduledRooms],
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
          onRequestClose={() => setScheduleRoomToEdit(null)}
        />
      ) : null}
    </div>
  );
};
