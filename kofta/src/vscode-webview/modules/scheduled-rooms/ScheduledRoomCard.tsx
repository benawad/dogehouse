import { isToday, format } from "date-fns";
import { useAtom } from "jotai";
import React from "react";
import { useMutation } from "react-query";
import { wsMutation } from "../../../createWebsocket";
import { meAtom } from "../../atoms";
import { Avatar } from "../../components/Avatar";
import { Button } from "../../components/Button";
import { modalConfirm } from "../../components/ConfirmModal";
import { ScheduledRoom } from "../../types";

interface ScheduledRoomCardProps {
  onEdit: () => void;
  onDeleteComplete: () => void;
  info: ScheduledRoom;
}

export const ScheduledRoomCard: React.FC<ScheduledRoomCardProps> = ({
  onEdit,
  onDeleteComplete,
  info: { id, name, scheduledFor, creator, description },
}) => {
  const { mutateAsync, isLoading } = useMutation(wsMutation, {
    onSuccess: () => {
      onDeleteComplete();
    },
  });
  const [me] = useAtom(meAtom);
  const dt = new Date(scheduledFor);
  return (
    <div>
      <div className={`w-full ${"bg-simple-gray-33"} py-2.5 px-5 rounded-lg`}>
        <div className={`text-white`}>
          <div className={`flex justify-between`}>
            <div>
              {isToday(dt)
                ? format(dt, `K:mm a`)
                : format(dt, `MM/dd/yyyy K:mm a`)}
            </div>
            {me?.id === creator.id ? (
              <div className={`flex`}>
                <Button variant="small" onClick={() => onEdit()}>
                  edit
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
                    delete
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
          <div className={`flex items-center my-4`}>
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
          <div>
            {creator.displayName}
            {description ? ` | ` + description : ``}
          </div>
        </div>
      </div>
    </div>
  );
};
