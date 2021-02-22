import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  MessageSquare,
  Mic,
  MicOff,
  PhoneMissed,
  Settings,
  UserPlus,
} from "react-feather";
import { useHistory, useLocation } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, myCurrentRoomInfoAtom } from "../atoms";
import { RoomChat } from "../modules/room-chat/RoomChat";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { useShouldFullscreenChat } from "../modules/room-chat/useShouldFullscreenChat";
import { modalConfirm } from "./ConfirmModal";
import { Footer } from "./Footer";
import { RoomSettingsModal } from "./RoomSettingsModal";

interface BottomVoiceControlProps {}

const iconSize = 24;
const iconColor = "#8C8C8C";
const buttonStyleTw = tw`p-2.5 text-gray-400 text-sm flex-1`;

export const BottomVoiceControl: React.FC<BottomVoiceControlProps> = ({
  children,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [currentRoom] = useAtom(currentRoomAtom);
  const { muted, set } = useMuteStore();
  const [{ canSpeak, isCreator }] = useAtom(myCurrentRoomInfoAtom);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [
    toggleOpen,
    newUnreadMessages,
    iAmMentioned,
  ] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
    s.iAmMentioned,
  ]);

  const fullscreenChatOpen = useShouldFullscreenChat();

  const buttons = [];

  if (currentRoom) {
    buttons.push(
      <button
        className={buttonStyleTw}
        key="leave-room"
        onClick={() => {
          modalConfirm("Are you sure you want to leave?", () => {
            wsend({ op: "leave_room", d: {} });
            if (location.pathname.startsWith("/room")) {
              history.push("/");
            }
          });
        }}
        title="Leave current room"
      >
        <PhoneMissed
          className={tw`m-auto mb-1`}
          size={iconSize}
          color={iconColor}
        />
        Leave
      </button>,
      <button
        className={buttonStyleTw}
        key="chat"
        onClick={() => {
          toggleOpen();
        }}
      >
        <div className={tw`flex justify-center`}>
          <div className={tw`relative`}>
            <MessageSquare
              className={tw`m-auto mb-1`}
              size={iconSize}
              color={iconColor}
            />
            {newUnreadMessages ? (
              <span
                className={tw`absolute rounded-full`}
                style={{
                  backgroundColor: iAmMentioned ? "#ff3c00" : "#FF9900",
                  right: -2,
                  top: -1,
                  width: 10,
                  height: 10,
                }}
              />
            ) : null}
          </div>
        </div>
        Chat
      </button>,
      <button
        className={buttonStyleTw}
        key="invite"
        onClick={() => {
          wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
          history.push("/invite");
        }}
        title="Invite users to room"
      >
        <UserPlus
          className={tw`m-auto mb-1`}
          size={iconSize}
          color={iconColor}
        />
        Invite
      </button>
    );
    if (isCreator || canSpeak) {
      buttons.push(
        <button
          className={buttonStyleTw}
          key="mute"
          onClick={() => {
            wsend({
              op: "mute",
              d: { value: !muted },
            });
            set({ muted: !muted });
          }}
          title="Toggle mute microphone"
        >
          {muted ? (
            <MicOff
              className={tw`m-auto mb-1`}
              size={iconSize}
              color={iconColor}
            />
          ) : (
            <Mic
              className={tw`m-auto mb-1`}
              size={iconSize}
              color={iconColor}
            />
          )}
          {muted ? "Unmute" : "Mute"}
        </button>
      );
    }

    if (isCreator) {
      buttons.push(
        <button
          className={buttonStyleTw}
          key="to-public-room"
          onClick={() => {
            setSettingsOpen(true);
          }}
          title="Make room public!"
        >
          <Settings
            className={tw`m-auto mb-1`}
            size={iconSize}
            color={iconColor}
          />
          Settings
        </button>
      );
    }
  }

  return (
    <>
      <RoomSettingsModal
        open={settingsOpen}
        onRequestClose={() => setSettingsOpen(false)}
      />
      <div
        className={
          tw`${
            fullscreenChatOpen
              ? `fixed top-0 left-0 right-0 flex-col flex h-full`
              : `sticky`
          } bottom-0 w-full`
        }
      >
        {fullscreenChatOpen ? null : children}
        <RoomChat sidebar={false} />
        {currentRoom &&
        !fullscreenChatOpen &&
        !location.pathname.startsWith("/room") ? (
          <button
            onClick={() => history.push(`/room/${currentRoom.id}`)}
            className={tw`bg-tmpBg1 py-5 px-10 w-full flex`}
          >
            <span className={tw`text-tmpC1 overflow-hidden overflow-ellipsis font-semibold`}>
              {currentRoom.name}{" "}
            </span>
            <span className={tw`text-tmpC4 ml-2`}>
              {canSpeak ? "speaker" : "listener"}
            </span>
          </button>
        ) : null}
        <div
          style={{
            padding: "0 var(--container-paddding)",
          }}
          className={tw`border-gray-400 border w-full mt-auto`}
        >
          {currentRoom ? (
            <div className={tw`flex justify-around`}>{buttons}</div>
          ) : (
            <div
              style={{
                padding: "var(--container-paddding) 0",
              }}
            >
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
