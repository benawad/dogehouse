import { differenceInMilliseconds, isPast, isToday, sub } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useHistory } from "react-router-dom";
import {
  wsend,
  wsMutation,
  wsMutationThrowError,
} from "../../../createWebsocket";
import { useCurrentRoomStore } from "../../../webrtc/stores/useCurrentRoomStore";
import { AddToCalendarButton } from "../../components/add-to-calendar/AddToCalendarButton";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { modalConfirm } from "../../components/ConfirmModal";
import { ScheduledRoom } from "../../types";
import { roomToCurrentRoom } from "../../utils/roomToCurrentRoom";
import { useMeQuery } from "../../utils/useMeQuery";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";
import { useRoomChatStore } from "../room-chat/useRoomChatStore";
import { CopyScheduleRoomLinkButton } from "./CopyScheduleRoomLinkButton";

interface ScheduledRoomCardProps {
  onEdit: () => void;
  onDeleteComplete: () => void;
  info: ScheduledRoom;
  noCopyLinkButton?: boolean;
}

export const ScheduledRoomCard: React.FC<ScheduledRoomCardProps> = ({
  onEdit,
  onDeleteComplete,
  noCopyLinkButton,
  info: { id, name, scheduledFor, creator, description, roomId },
}) => {
  const history = useHistory();
  const {
    mutateAsync: mutateAsyncStartRoom,
    isLoading: isLoadingStartRoom,
  } = useMutation(wsMutationThrowError, {
    onSuccess: ({ room }) => {
      console.log("new room voice server id: " + room.voiceServerId);
      useRoomChatStore.getState().clearChat();
      wsend({ op: "get_current_room_users", d: {} });
      history.push("/room/" + room.id);
      useCurrentRoomStore
        .getState()
        .setCurrentRoom(() => roomToCurrentRoom(room));
    },
  });
  const { mutateAsync, isLoading } = useMutation(wsMutation, {
    onSuccess: () => {
      onDeleteComplete();
    },
  });
  const [, rerender] = useState(0);
  const dt = useMemo(() => new Date(scheduledFor), [scheduledFor]);
  const canStartRoom = useMemo(() => isPast(sub(dt, { minutes: 10 })), [dt]);
  useEffect(() => {
    let done = false;
    const id = setTimeout(() => {
      done = true;
      rerender((x) => x + 1);
    }, Math.min(differenceInMilliseconds(sub(dt, { minutes: 10 }), new Date()) + 1000, 0)); // + 1 second to be safe
    return () => {
      if (!done) {
        clearTimeout(id);
      }
    };
  }, [dt]);
  const { me } = useMeQuery();
  const { t } = useTypeSafeTranslation();
  const isCreator = me?.id === creator.id;
  const url = window.location.origin + `/scheduled-room/${id}`;
  return (
    <div>
      <div className={`w-full bg-simple-gray-33 py-2.5 px-5 rounded-lg`}>
        <div className={`text-white`}>
          <div className={`flex justify-between`}>
            <div>
              {isToday(dt)
                ? t("common.formattedIntlTime", { time: dt })
                : t("common.formattedIntlDate", { date: dt })}
            </div>
            {isCreator ? (
              <div className={`flex`}>
                <Button variant="small" onClick={() => onEdit()}>
                  {t("common.edit")}
                </Button>
                <div className={`ml-4`}>
                  <Button
                    loading={isLoading}
                    variant="small"
                    onClick={() =>
                      modalConfirm(
                        "Are you sure you want to delete this scheduled room?",
                        () => {
                          mutateAsync({
                            op: "delete_scheduled_room",
                            d: { id },
                          });
                        }
                      )
                    }
                  >
                    {t("common.delete")}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <div className={`flex justify-between my-4`}>
            <div>
              <div className={`relative inline-flex`} /* this is to aline the avatar and room name */ >
                <Avatar size={25} src={creator.avatarUrl} />
                <div 
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                  }}
                  className={`ml-2 text-left flex-1 text-xl text-simple-gray-d9 text-ellipsis overflow-hidden break-all`}
                >
                  {name.slice(0, 100)}
                </div>
              </div>  
              <div className={`break-all`}>
                {creator.displayName}
                {description ? ` | ` + description : ``}                
              </div>
            </div>
            <div>
              <AddToCalendarButton
                event={{
                  name: name,
                  details: description,
                  location: url,
                  startsAt: dt.toISOString(),
                  endsAt: new Date(
                    dt.getTime() + 1 * 60 * 60 * 1000
                  ).toISOString(),
                }}
              />
              {noCopyLinkButton ? null : (
                <CopyScheduleRoomLinkButton text={url} />
              )}
            </div>
            
          </div>
       
          {canStartRoom ? (
            <div className={`mt-4`}>
              {isCreator ? (
                <Button
                  loading={isLoadingStartRoom}
                  onClick={() => {
                    mutateAsyncStartRoom({
                      op: "create_room_from_scheduled_room",
                      d: {
                        id,
                        name,
                        description,
                      },
                    });
                  }}
                >
                  {t("modules.scheduledRooms.startRoom")}
                </Button>
              ) : (
                roomId && (
                  <Button
                    loading={isLoadingStartRoom}
                    onClick={() => {
                      wsend({ op: "join_room", d: { roomId } });
                      history.push("/room/" + roomId);
                    }}
                  >
                    {t("common.joinRoom")}
                  </Button>
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
