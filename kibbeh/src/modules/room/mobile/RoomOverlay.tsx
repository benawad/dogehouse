import React from "react";
import { createPortal } from "react-dom";
import { useSpring, a, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import {
  SolidDeafened,
  SolidDeafenedOff,
  SolidFriendsAdd,
  SolidMicrophone,
  SolidMicrophoneOff,
  SolidSettings,
  SolidSimpleMegaphone,
} from "../../../icons";
import { RoomChatController } from "../RoomChatController";
import useWindowSize from "../../../shared-hooks/useWindowSize";
import { BoxedIcon } from "../../../ui/BoxedIcon";
import useViewportSize from "../../../shared-hooks/useViewportSize";

interface RoomOverlayProps {
  mute?: {
    isMuted: boolean;
    onMute: () => void;
  };
  deaf?: {
    isDeaf: boolean;
    onDeaf: () => void;
  };
  onInvitePeopleToRoom?: () => void;
  onRoomSettings?: () => void;
  askToSpeak?: () => void;
  setListener: () => void;
  canSpeak: boolean;
}

const RoomOverlay: React.FC<RoomOverlayProps> = ({
  mute,
  deaf,
  onInvitePeopleToRoom,
  onRoomSettings,
  askToSpeak,
  setListener,
  canSpeak,
}) => {
  const { height: windowHeight } = useWindowSize();
  const { height: viewportHeight } = useViewportSize();
  const height = windowHeight - 30 - 100;
  const [{ y }, set] = useSpring(() => ({ y: height }));

  const open = () => {
    set({
      y: 0,
      immediate: false,
      config: { mass: 1, tension: 200, friction: 25 },
    });
  };

  const close = (velocity = 0) => {
    set({
      y: height,
      immediate: false,
      config: { ...config.default, velocity: velocity * 1.2 }, // @todo clamp velo between 0 and something
    });
  };

  const bind = useDrag(
    ({ last, vxvy: [, vy], movement: [, my], cancel, canceled }) => {
      if (my > height) cancel(); // @todo fix weird bottom spacing
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
          height: viewportHeight - 30,
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
                  !mute?.isMuted && !deaf?.isDeaf ? "bg-accent text-button" : ""
                }`}
                onClick={mute?.onMute}
                hover
              >
                {mute?.isMuted || deaf?.isDeaf ? (
                  <SolidMicrophoneOff width="20" height="20" />
                ) : (
                  <SolidMicrophone width="20" height="20" />
                )}
              </BoxedIcon>
            ) : (
              <BoxedIcon
                className={`w-9 h-6.5 ${
                  !askToSpeak ? "bg-accent text-button" : ""
                }`}
                hover
                onClick={askToSpeak ? askToSpeak : setListener}
              >
                <SolidSimpleMegaphone width="20" height="20" />
              </BoxedIcon>
            )}
          </div>
          <div className="flex">
            {onRoomSettings ? (
              <BoxedIcon
                circle
                className="h-6.5 w-6.5 mr-3"
                onClick={onRoomSettings}
                hover
              >
                <SolidSettings width="20" height="20" />
              </BoxedIcon>
            ) : null}
            <BoxedIcon
              circle
              className={`h-6.5 w-6.5 mr-3 ${
                deaf?.isDeaf ? "bg-accent text-button" : ""
              }`}
              onClick={deaf?.onDeaf}
              hover
            >
              {deaf?.isDeaf ? (
                <SolidDeafenedOff width="20" height="20" />
              ) : (
                <SolidDeafened width="20" height="20" />
              )}
            </BoxedIcon>
            <BoxedIcon
              circle
              className="h-6.5 w-6.5"
              hover
              onClick={onInvitePeopleToRoom}
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
