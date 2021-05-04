import { JoinRoomAndGetInfoResponse, wrap } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useSpring, a, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import {
  SolidDeafened,
  SolidDeafenedOff,
  SolidFriendsAdd,
  SolidMicrophone,
  SolidMicrophoneOff,
  SolidSimpleMegaphone,
} from "../../icons";
import { RoomChatController } from "../../modules/room/RoomChatController";
import { useSplitUsersIntoSections } from "../../modules/room/useSplitUsersIntoSections";
import { useConn } from "../../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../../shared-hooks/useCurrentRoomInfo";
import { useSetDeaf } from "../../shared-hooks/useSetDeaf";
import { useSetMute } from "../../shared-hooks/useSetMute";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import useWindowSize from "../../shared-hooks/useWindowSize";
import { BoxedIcon } from "../BoxedIcon";

interface RoomOverlayProps extends JoinRoomAndGetInfoResponse {}

const RoomOverlay: React.FC<RoomOverlayProps> = (props) => {
  const { currentRoomId } = useCurrentRoomIdStore();
  const { muted } = useMuteStore();
  const conn = useConn();
  const setMute = useSetMute();
  const { deafened } = useDeafStore();
  const setDeaf = useSetDeaf();
  const { canSpeak, isCreator } = useCurrentRoomInfo();
  const { height: vHeight } = useWindowSize();
  const height = vHeight - 30 - 100;
  const [{ y }, set] = useSpring(() => ({ y: height }));
  const [isOpen, setOpen] = useState(false);
  const { canIAskToSpeak } = useSplitUsersIntoSections(props);
  const { mutateAsync: setListener } = useTypeSafeMutation("setListener");
  const { push } = useRouter();

  const open = () => {
    set({
      y: 0,
      immediate: false,
      config: { mass: 1, tension: 200, friction: 25 },
    });
    setOpen(true);
  };

  const close = (velocity = 0) => {
    set({
      y: height,
      immediate: false,
      config: { ...config.default, velocity: velocity * 1.2 }, // @todo clamp velo between 0 and something
    });
    setOpen(false);
  };

  const bind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      if (my > height || isOpen) cancel(); // @todo fix weird bottom spacing
      if (last) {
        if (my > height * 0.8 || vy > 0.1) close(vy);
        else open();
      } else {
        set({ y: my, immediate: true });
      }
    },
    {
      initial: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: 0 },
      rubberband: true,
    }
  );

  const bgStyle = {
    opacity: y.to([0, height], [0.8, 0], "clamp"),
    display: y.to((py) => (py < height ? "block" : "none")),
  };

  return createPortal(
    <>
      <a.div
        className="w-screen h-screen absolute left-0 bg-black z-10 opacity-100"
        style={bgStyle}
        onClick={() => close()}
      ></a.div>
      <a.div
        className="bg-primary-800 w-full rounded-t-20 z-10 absolute bottom-0 flex flex-col"
        style={{
          bottom: `calc(-100% + ${height + 100 + 30}px)`,
          height: vHeight - 30,
          y,
          zIndex: 11,
          touchAction: "none",
        }}
      >
        <div
          className="bg-primary-600 rounded-full w-6 absolute top-3 left-2/4 transform -translate-x-1/2"
          style={{ height: 4 }}
        ></div>
        {/* We bind it to the header so scroll in chat doesn't close the overlay */}
        <a.div {...bind()} className="flex justify-between p-4.5">
          <div>
            {canSpeak ? (
              <BoxedIcon
                className={`w-9 h-6.5 ${
                  !muted && !deafened ? "bg-accent text-button" : ""
                }`}
                onClick={() => setMute(!muted)}
                hover
              >
                {muted || deafened ? (
                  <SolidMicrophoneOff width="20" height="20" />
                ) : (
                  <SolidMicrophone width="20" height="20" />
                )}
              </BoxedIcon>
            ) : (
              <BoxedIcon
                className={`w-9 h-6.5 ${
                  !canIAskToSpeak ? "bg-accent text-button" : ""
                }`}
                hover
                onClick={
                  canIAskToSpeak
                    ? () => wrap(conn).mutation.askToSpeak()
                    : () => setListener([conn.user.id])
                }
              >
                <SolidSimpleMegaphone width="20" height="20" />
              </BoxedIcon>
            )}
          </div>
          <div className="flex">
            <BoxedIcon
              circle
              className={`h-6.5 w-6.5 mr-3 ${
                deafened ? "bg-accent text-button" : ""
              }`}
              onClick={() => setDeaf(!deafened)}
              hover
            >
              {deafened ? (
                <SolidDeafenedOff width="20" height="20" />
              ) : (
                <SolidDeafened width="20" height="20" />
              )}
            </BoxedIcon>
            <BoxedIcon
              circle
              className="h-6.5 w-6.5"
              hover
              onClick={() =>
                push(`/room/[id]/invite`, `/room/${currentRoomId}/invite`)
              }
            >
              <SolidFriendsAdd width="20" height="20" />
            </BoxedIcon>
          </div>
        </a.div>
        <RoomChatController />
      </a.div>
    </>,
    document.querySelector("#__next")!
  );
};

export default RoomOverlay;
