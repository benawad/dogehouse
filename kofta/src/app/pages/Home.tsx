import React, { useEffect, useState } from "react";
import { Calendar } from "react-feather";
import { useQuery, useQueryClient } from "react-query";
import { useHistory } from "react-router-dom";
import { wsend, wsFetch } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { useSocketStatus } from "../../webrtc/stores/useSocketStatus";
import { BodyWrapper } from "../components/BodyWrapper";
import { BottomVoiceControl } from "../components/BottomVoiceControl";
import { Button } from "../components/Button";
import { CircleButton } from "../components/CircleButton";
import { CreateRoomModal } from "../components/CreateRoomModal";
import { modalConfirm } from "../components/ConfirmModal";
import { ProfileButton } from "../components/ProfileButton";
import { RoomCard } from "../components/RoomCard";
import { Spinner } from "../components/Spinner";
import { Wrapper } from "../components/Wrapper";
import { EditScheduleRoomModalController } from "../modules/scheduled-rooms/EditScheduleRoomModalController";
import { ScheduledRoomCard } from "../modules/scheduled-rooms/ScheduledRoomCard";
import { GET_SCHEDULED_ROOMS } from "../modules/scheduled-rooms/ScheduledRoomsPage";
import { Logo } from "../svgs/Logo";
import { PeopleIcon } from "../svgs/PeopleIcon";
import { CurrentRoom, PublicRoomsQuery, ScheduledRoom } from "../types";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import isElectron from "is-electron";
import { modalAlert } from "../components/AlertModal";

const isMac = process.platform === 'darwin';

interface HomeProps { }

const get_top_public_rooms = "get_top_public_rooms";

const Page = ({
  currentRoom,
  cursor,
  isLastPage,
  isOnlyPage,
}: {
  currentRoom: CurrentRoom | null;
  cursor: number;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: number) => void;
}) => {
  const { t } = useTypeSafeTranslation();
  const history = useHistory();
  const { status } = useSocketStatus();
  const { isLoading, data, refetch } = useQuery<PublicRoomsQuery>(
    [get_top_public_rooms, cursor],
    () =>
      wsFetch<any>({
        op: get_top_public_rooms,
        d: { cursor },
      }),
    {
      staleTime: Infinity,
      enabled: status === "auth-good",
      refetchOnMount: "always",
      refetchInterval: 10000,
    }
  );

  useEffect(() => {
    if (isElectron() && isMac) {
      modalAlert(t("common.requestPermissions"));
    }
  }, [t]);

  if (isLoading) {
    return <Spinner centered={true} />;
  }

  if (!data) {
    return null;
  }

  if (isOnlyPage && data.rooms.length === 0) {
    return (
      <Button variant="small" onClick={() => refetch()}>
        {t("pages.home.refresh")}
      </Button>
    );
  }



  return (
    <>
      <Button variant="small" onClick={() => refetch()}>
        {t("pages.home.refresh")}
      </Button>
      {data.rooms.map((r) =>
        r.id === currentRoom?.id ? null : (
          <div className={`mt-4`} key={r.id}>
            <RoomCard
              onClick={() => {
                const joinRoom = () => {
                  wsend({ op: "join_room", d: { roomId: r.id } });
                  history.push("/room/" + r.id);
                };
                currentRoom
                  ? modalConfirm(
                    `Leave room '${currentRoom.name}' and join room '${r.name}'?`,
                    joinRoom
                  )
                  : joinRoom();
              }}
              room={r}
              currentRoomId={currentRoom?.id}
            />
          </div>
        )
      )}
      {isLastPage && data.nextCursor ? (
        <div className={`flex justify-center my-10`}>
          <Button
            variant="small"
            onClick={() =>
              wsend({
                op: "get_top_public_rooms",
                d: { cursor: data.nextCursor },
              })
            }
          >
            {t("common.loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

const get_my_scheduled_rooms_about_to_start =
  "get_my_scheduled_rooms_about_to_start";

export type GetMyScheduledRoomsAboutToStartQuery = {
  scheduledRooms: ScheduledRoom[];
};

export const Home: React.FC<HomeProps> = () => {
  const { t } = useTypeSafeTranslation();
  const history = useHistory();
  const { currentRoom } = useCurrentRoomStore();
  const [cursors, setCursors] = useState([0]);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showBetaPrompt, setShowBetaPrompt] = useState(true)
  const queryClient = useQueryClient();
  const { status } = useSocketStatus();
  const { data } = useQuery<GetMyScheduledRoomsAboutToStartQuery>(
    get_my_scheduled_rooms_about_to_start,
    () => wsFetch<any>({ op: get_my_scheduled_rooms_about_to_start, d: {} }),
    {
      staleTime: Infinity,
      enabled: status === "auth-good",
      refetchOnMount: "always",
    }
  );

  return (
    <div className={`flex flex-col flex-1`}>
      <Wrapper>
        <BodyWrapper>
          <div className={`mb-10 mt-8`}>
            <Logo />
            {showBetaPrompt
              ?
              <div className={isElectron() ?
                "mt-4 grid lg:grid-cols-5 sm:grid-rows-2 lg:grid-rows-1 p-4 bg-simple-gray-33 rounded-md lg:grid"
                : "mt-4 grid lg:grid-cols-5 sm:grid-rows-2 lg:grid-rows-1 p-4 bg-simple-gray-33 rounded-md hidden lg:grid"
              }>
                <div className="col-span-3">
                  <div className="relative top-1/2" style={{ transform: "translateY(-50%)" }}>
                    <h2 className="font-bold text-2xl text-opacity-90 text-white">The Desktop Beta is here</h2>
                    <h3 className="font-semibold text-opacity-80 text-white">Would you like to test it?</h3>
                  </div>
                </div>
                <div className="col-span-2 space-x-3 flex flex-1 my-5">
                  <a href="https://next.dogehouse.tv" className="rounded capitalize outline-none w-full flex items-center justify-center text-center text-white button-fix bg-blue-500 hover:bg-blue-400 py-2.5 px-1">Let's Go</a>
                  <button onClick={() => setShowBetaPrompt(false)} className="rounded capitalize outline-none w-full flex items-center justify-center text-center text-white button-fix bg-simple-gray-23 hover:bg-simple-gray-26 py-2.5 px-1">No thanks</button>
                </div>
              </div> : ""}
          </div>
          <div
            className={`mb-6 flex justify-center`}
            style={{ flexWrap: "wrap", gap: "1rem" }}
          >
            <div /* className={`mr-4 px-2.5`} */>
              <CircleButton
                title={t("pages.viewUser.following")}
                onClick={() => {
                  wsend({ op: "fetch_following_online", d: { cursor: 0 } });
                  history.push("/following-online");
                }}
              >
                <PeopleIcon width={30} height={30} fill="#fff" />
              </CircleButton>
            </div>
            <div /* className={`ml-2 px-2.5`} */>
              <CircleButton
                title={t("modules.scheduledRooms.title")}
                onClick={() => {
                  queryClient.prefetchQuery(
                    [GET_SCHEDULED_ROOMS, "", false],
                    () =>
                      wsFetch({
                        op: GET_SCHEDULED_ROOMS,
                        d: {
                          cursor: "",
                          getOnlyMyScheduledRooms: false,
                        },
                      }),
                    { staleTime: 0 }
                  );
                  history.push("/scheduled-rooms");
                }}
              >
                <Calendar width={30} height={30} color="#fff" />
              </CircleButton>
            </div>
            <div /* className={`ml-2 px-2.5`} */>
              <ProfileButton circle size={60} />
            </div>
          </div>
          <EditScheduleRoomModalController
            onScheduledRoom={(editInfo, data, _resp) => {
              queryClient.setQueryData<GetMyScheduledRoomsAboutToStartQuery>(
                get_my_scheduled_rooms_about_to_start,
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
                  };
                }
              );
            }}
          >
            {({ onEdit }) =>
              data?.scheduledRooms.map((sr) => (
                <ScheduledRoomCard
                  key={sr.id}
                  info={sr}
                  onEdit={() => onEdit({ scheduleRoomToEdit: sr, cursor: "" })}
                  onDeleteComplete={() => {
                    queryClient.setQueryData<
                      GetMyScheduledRoomsAboutToStartQuery
                    >(get_my_scheduled_rooms_about_to_start, (d) => {
                      return {
                        scheduledRooms: d?.scheduledRooms.filter(
                          (x) => x.id !== sr.id
                        ) as ScheduledRoom[],
                      };
                    });
                  }}
                />
              ))
            }
          </EditScheduleRoomModalController>
          {currentRoom ? (
            <div className={`my-8`}>
              <RoomCard
                active
                onClick={() => history.push("/room/" + currentRoom.id)}
                room={currentRoom}
                currentRoomId={currentRoom.id}
              />
            </div>
          ) : null}
          {cursors.map((cursor, i) => (
            <Page
              key={cursor}
              currentRoom={currentRoom}
              cursor={cursor}
              isOnlyPage={cursors.length === 1}
              onLoadMore={(c) => setCursors([...cursors, c])}
              isLastPage={i === cursors.length - 1}
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
              setShowCreateRoomModal(true);
            }}
          >
            <h3 className={`text-2xl`}>{t("pages.home.createRoom")}</h3>
          </Button>
        </div>
      </BottomVoiceControl>
      {showCreateRoomModal ? (
        <CreateRoomModal onRequestClose={() => setShowCreateRoomModal(false)} />
      ) : null}
    </div>
  );
};
