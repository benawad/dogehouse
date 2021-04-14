import { ScheduledRoom } from "@dogehouse/kebab";
import { differenceInMilliseconds, isPast, isToday, sub } from "date-fns";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { SingleUser } from "../../ui/UserAvatar";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { AddToCalendarButton } from "./AddToCalendarButton";
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
  const { push } = useRouter();
  const {
    mutateAsync: mutateAsyncStartRoom,
    isLoading: isLoadingStartRoom,
  } = useTypeSafeMutation("createRoomFromScheduledRoom", {
    onSuccess: ({ room }) => {
      push("/room/" + room.id);
    },
  });
  const { mutateAsync, isLoading } = useTypeSafeMutation(
    "deleteScheduledRoom",
    {
      onSuccess: () => {
        onDeleteComplete();
      },
    }
  );
  const [, rerender] = useState(0);
  const dt = useMemo(() => new Date(scheduledFor), [scheduledFor]);
  const canStartRoom = useMemo(() => isPast(sub(dt, { minutes: 10 })), [dt]);
  useEffect(() => {
    let done = false;
    const timeoutId = setTimeout(() => {
      done = true;
      rerender((x) => x + 1);
    }, Math.min(differenceInMilliseconds(sub(dt, { minutes: 10 }), new Date()) + 1000, 0)); // + 1 second to be safe
    return () => {
      if (!done) {
        clearTimeout(timeoutId);
      }
    };
  }, [dt]);
  const { conn } = useContext(WebSocketContext);
  const me = conn?.user;
  const { t } = useTypeSafeTranslation();
  const isCreator = me?.id === creator.id;
  const url = window.location.origin + `/scheduled-room/${id}`;
  return (
    <div className="flex">
      <div
        className={`flex p-4 w-full bg-primary-800 rounded-lg flex flex-col text-primary-100`}
      >
        <div className={`flex flex justify-between`}>
          <div className="flex">
            {isToday(dt)
              ? t("common.formattedIntlTime", { time: dt })
              : t("common.formattedIntlDate", { date: dt })}
          </div>
          {isCreator ? (
            <div className={`flex flex`}>
              <Button size="small" onClick={() => onEdit()}>
                {t("common.edit")}
              </Button>
              <div className={`flex ml-4`}>
                <Button
                  loading={isLoading}
                  size="small"
                  onClick={() =>
                    modalConfirm(
                      "Are you sure you want to delete this scheduled room?",
                      () => {
                        mutateAsync([id]);
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
        <div className={`flex flex justify-between my-4`}>
          <div className="flex flex-col">
            <div
              className={`flex relative inline-flex`} /* this is to aline the avatar and room name */
            >
              <SingleUser size="sm" src={creator.avatarUrl} />
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
            <div className={`flex break-all`}>
              {creator.displayName}
              {description ? ` | ` + description : ``}
            </div>
          </div>
          <div className="flex">
            <AddToCalendarButton
              event={{
                name,
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
          <div className={`flex mt-4`}>
            {isCreator ? (
              <Button
                loading={isLoadingStartRoom}
                onClick={() => {
                  mutateAsyncStartRoom([
                    {
                      id,
                      name,
                      description,
                    },
                  ]);
                }}
              >
                {t("modules.scheduledRooms.startRoom")}
              </Button>
            ) : (
              roomId && (
                <Button
                  loading={isLoadingStartRoom}
                  onClick={() => {
                    push("/room/" + roomId);
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
  );
};
