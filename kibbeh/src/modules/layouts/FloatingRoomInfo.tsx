import { useRouter } from "next/router";
import React from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { SolidMicrophone, SolidVolume } from "../../icons";
import SvgSolidMicrophoneOff from "../../icons/SolidMicrophoneOff";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useSetDeaf } from "../../shared-hooks/useSetDeaf";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { BoxedIcon } from "../../ui/BoxedIcon";
import SvgSolidVolumeOff from "../../icons/SolidVolumeOff";

interface MinimizedRoomCardControllerProps {}

export const FloatingRoomInfo: React.FC<MinimizedRoomCardControllerProps> = () => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const { data } = useTypeSafeQuery(
    ["joinRoomAndGetInfo", currentRoomId!],
    { enabled: !!currentRoomId },
    [currentRoomId!]
  );
  const { canSpeak } = useCurrentRoomInfo();
  const { muted } = useMuteStore();
  const setMute = useSetMute();
  const { deafened } = useDeafStore();
  const setDeaf = useSetDeaf();
  const router = useRouter();

  if (!data || "error" in data) {
    return null;
  }

  const { room } = data;

  return (
    <div
      style={{ maxWidth: "70vw" }}
      className="flex fixed bottom-6 right-6 border-accent border rounded-8 bg-primary-800 items-center"
    >
      <button
        onClick={() => {
          router.push(`/room/${room.id}`);
        }}
        style={{ minWidth: 100 }}
        className="truncate text-primary-100 mr-4 p-3"
      >
        {room.name}
      </button>
      {canSpeak ? (
        <div className="flex py-2 pr-2">
          <BoxedIcon
            onClick={() => {
              setMute(!muted);
            }}
            className={muted ? "bg-accent" : ""}
          >
            {muted ? (
              <SvgSolidMicrophoneOff data-testid="mic-off-icon" />
            ) : (
              <SolidMicrophone data-testid="mic-icon" />
            )}
          </BoxedIcon>
          <BoxedIcon
            onClick={() => {
              setDeaf(!deafened);
            }}
            className={deafened ? "bg-accent" : ""}
          >
            {deafened ? (
              <SvgSolidVolumeOff data-testid="mic-off-icon" />
            ) : (
              <SolidVolume data-testid="mic-icon" />
            )}
          </BoxedIcon>
        </div>
      ) : null}
    </div>
  );
};
