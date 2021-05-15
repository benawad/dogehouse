import { ScheduledRoom } from "@dogehouse/kebab";
import { differenceInMilliseconds, isPast, isToday, sub } from "date-fns";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { SolidCalendar, SolidRocket } from "../../icons";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { BoxedIcon } from "../../ui/BoxedIcon";
import { Button } from "../../ui/Button";
import { SingleUser } from "../../ui/UserAvatar";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { CopyScheduleRoomLinkButton } from "./CopyScheduleRoomLinkButton";
import { Edit, Trash } from "react-feather";
import { AddToCalendar } from "./AddToCalendar";

interface ScheduledRoomCardProps {
  onEdit: () => void;
  onDeleteComplete: () => void;
  info: ScheduledRoom;
  noCopyLinkButton?: boolean;
  noEditOrDeleteButton?: boolean;
}

export const ScheduledRoomCard: React.FC<ScheduledRoomCardProps> = ({
  onEdit,
  onDeleteComplete,
  noCopyLinkButton,
  noEditOrDeleteButton = false,
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
        className={`p-4 w-full text-base bg-primary-800 rounded-lg flex flex-col text-primary-100`}
      >
        <div className={`flex justify-between`}>
          <div className="flex w-full">
            <div
              className="flex flex-1 font-bold text-ellipsis overflow-hidden break-all mb-4"
              data-testid={`scheduledroom:name:${name}`}
            >
              {name}
            </div>
            <div className="flex gap-2">
              <AddToCalendar
                event={{
                  name,
                  details: description,
                  location: url,
                  startsAt: dt.toISOString(),
                  endsAt: new Date(
                    dt.getTime() + 1 * 60 * 60 * 1000
                  ).toISOString(),
                }}
                filename={name}
              >
                {(toggle) => (
                  <BoxedIcon onClick={toggle}>
                    <SolidCalendar />
                  </BoxedIcon>
                )}
              </AddToCalendar>
              {noCopyLinkButton ? null : (
                <CopyScheduleRoomLinkButton text={url} />
              )}
              {isCreator && !noEditOrDeleteButton ? (
                <>
                  <BoxedIcon onClick={() => onEdit()}>
                    <Edit size={18} />
                  </BoxedIcon>
                  <BoxedIcon
                    onClick={() =>
                      modalConfirm(
                        "Are you sure you want to delete this scheduled room?",
                        () => {
                          mutateAsync([id]);
                        }
                      )
                    }
                  >
                    <Trash size={18} />
                  </BoxedIcon>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className={`flex justify-between`}>
          <div className="flex flex-col">
            <div className={`relative inline-flex mb-4`}>
              <SingleUser size="xs" src={creator.avatarUrl} />
              <div
                style={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
                className={`ml-2 text-left flex-1`}
              >
                {creator.displayName}
              </div>
            </div>
            <div className={`inline break-all`}>
              <span className="text-accent">
                {isToday(dt)
                  ? t("common.formattedIntlTime", { time: dt })
                  : t("common.formattedIntlDate", { date: dt })}
              </span>
              {description ? ` | ` + description : ``}
            </div>
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
