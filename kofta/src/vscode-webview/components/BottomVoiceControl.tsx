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
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, myCurrentRoomInfoAtom } from "../atoms";
import { RoomChat } from "../modules/room-chat/RoomChat";
import { useRoomChatMentionStore } from "../modules/room-chat/useRoomChatMentionStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { useShouldFullscreenChat } from "../modules/room-chat/useShouldFullscreenChat";
import { modalConfirm } from "./ConfirmModal";
import { Footer } from "./Footer";
import { RoomSettingsModal } from "./RoomSettingsModal";

interface BottomVoiceControlProps {}

const iconSize = 24;
const iconColor = "#8C8C8C";
const buttonStyle = `px-2.5 text-simple-gray-8c text-sm flex-1`;

export const BottomVoiceControl: React.FC<BottomVoiceControlProps> = ({
  children,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [currentRoom] = useAtom(currentRoomAtom);
  const { muted, set } = useMuteStore();
  const [{ canSpeak, isCreator }] = useAtom(myCurrentRoomInfoAtom);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toggleOpen, newUnreadMessages] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
  ]);

  const { iAmMentioned } = useRoomChatMentionStore();

  const fullscreenChatOpen = useShouldFullscreenChat();

  const buttons = [];

  if (currentRoom) {
    buttons.push(
      <button
        className={buttonStyle}
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
          className={`m-auto mb-1`}
          size={iconSize}
          color={iconColor}
        />
        Leave
      </button>,
      <button
        className={buttonStyle}
        key="chat"
        onClick={() => {
          toggleOpen();
        }}
      >
        <div className={`flex justify-center`}>
          <div className={`relative`}>
            <MessageSquare
              className={`m-auto mb-1`}
              size={iconSize}
              color={iconColor}
            />
            {newUnreadMessages ? (
              <span
                className={`absolute rounded-full w-2.5 h-2.5`}
                style={{
                  backgroundColor: iAmMentioned ? "#ff3c00" : "#FF9900",
                  right: -2,
                  top: -1,
                }}
              />
            ) : null}
          </div>
        </div>
        Chat
      </button>,
      <button
        className={buttonStyle}
        key="invite"
        onClick={() => {
          wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
          history.push("/invite");
        }}
        title="Invite users to room"
      >
        <UserPlus className={`m-auto mb-1`} size={iconSize} color={iconColor} />
        Invite
      </button>
    );
    if (isCreator || canSpeak) {
      buttons.push(
        <button
          className={buttonStyle}
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
              className={`m-auto mb-1`}
              size={iconSize}
              color={iconColor}
            />
          ) : (
            <Mic className={`m-auto mb-1`} size={iconSize} color={iconColor} />
          )}
          {muted ? "Unmute" : "Mute"}
        </button>
      );
    }

    if (isCreator) {
      buttons.push(
        <button
          className={buttonStyle}
          key="to-public-room"
          onClick={() => {
            setSettingsOpen(true);
          }}
          title="Make room public!"
        >
          <Settings
            className={`m-auto mb-1`}
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
        className={`${
          fullscreenChatOpen
            ? `fixed top-0 left-0 right-0 flex-col flex h-full`
            : `sticky`
        } bottom-0 w-full`}
      >
        {fullscreenChatOpen ? null : children}
        <RoomChat sidebar={false} />
        {currentRoom &&
        !fullscreenChatOpen &&
        !location.pathname.startsWith("/room") ? (
          <button
            onClick={() => history.push(`/room/${currentRoom.id}`)}
            className={`bg-simple-gray-26 py-5 px-10 w-full flex`}
          >
            <span
              className={`text-simple-gray-a6 overflow-hidden overflow-ellipsis font-semibold`}
            >
              {currentRoom.name}{" "}
            </span>
            <span className={`text-blue-500 ml-2`}>
              {canSpeak ? "speaker" : "listener"}
            </span>
          </button>
        ) : null}
        <div
          className={`border-simple-gray-80 bg-simple-gray-26 border-t w-full mt-auto p-5`}
        >
          {currentRoom ? (
            <div className={`flex justify-around`}>{buttons}</div>
          ) : (
            <div className={`px-5`}>
              <Footer />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
