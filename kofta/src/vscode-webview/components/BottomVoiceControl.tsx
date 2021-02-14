import { useAtom } from "jotai";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, myCurrentRoomInfoAtom } from "../atoms";
import {
  PhoneMissed,
  UserPlus,
  Mic,
  MicOff,
  X,
  Settings,
  MessageSquare,
} from "react-feather";
import { Footer } from "./Footer";
import { renameRoomAndMakePublic } from "../../webrtc/utils/renameRoomAndMakePublic";
import { renameRoomAndMakePrivate } from "../../webrtc/utils/renameRoomAndMakePrivate";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { RoomChat } from "../modules/room-chat/RoomChat";
import { useShouldFullscreenChat } from "../modules/room-chat/useShouldFullscreenChat";

interface BottomVoiceControlProps {}

const iconSize = 24;
const iconColor = "#8C8C8C";
const buttonStyle = {
  padding: "10px",
  color: "#8C8C8C",
  fontSize: 14,
  flex: 1,
};

export const BottomVoiceControl: React.FC<BottomVoiceControlProps> = ({
  children,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const { muted, set } = useMuteStore();
  const [{ canSpeak, isCreator }] = useAtom(myCurrentRoomInfoAtom);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toggleOpen, newUnreadMessages] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
  ]);

  const fullscreenChatOpen = useShouldFullscreenChat();

  const buttons = [];

  if (currentRoom) {
    buttons.push(
      <button
        style={buttonStyle}
        key="leave-room"
        onClick={() => {
          const y = window.confirm("Are you sure you want to leave?");
          if (y) {
            wsend({ op: "leave_room", d: {} });
            if (location.pathname.startsWith("/room")) {
              history.push("/");
            }
          }
        }}
        title="Leave current room"
      >
        <PhoneMissed
          style={{ margin: "auto", marginBottom: "3px" }}
          size={iconSize}
          color={iconColor}
        />
        Leave
      </button>,
      <button
        style={buttonStyle}
        key="chat"
        onClick={() => {
          toggleOpen();
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative" }}>
            <MessageSquare
              style={{ margin: "auto", marginBottom: "3px" }}
              size={iconSize}
              color={iconColor}
            />
            {newUnreadMessages ? (
              <span
                className={tw`-top-1 bg-yellow-600 flex items-center justify-center inline-flex absolute rounded-full text-sm font-semibold w-6 h-6`}
                style={{
                  backgroundColor: "#FF9900",
                  color: "#fff",
                }}
              >
                {newUnreadMessages}
              </span>
            ) : null}
          </div>
        </div>
        Chat
      </button>,
      <button
        style={buttonStyle}
        key="invite"
        onClick={() => {
          wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
          history.push("/invite");
        }}
        title="Invite users to room"
      >
        <UserPlus
          style={{ margin: "auto", marginBottom: "3px" }}
          size={iconSize}
          color={iconColor}
        />
        Invite
      </button>
    );
    if (isCreator || canSpeak) {
      buttons.push(
        <button
          style={buttonStyle}
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
              style={{ margin: "auto", marginBottom: "3px" }}
              size={iconSize}
              color={iconColor}
            />
          ) : (
            <Mic
              style={{ margin: "auto", marginBottom: "3px" }}
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
          style={buttonStyle}
          key="to-public-room"
          onClick={() => {
            setSettingsOpen(true);
          }}
          title="Make room public!"
        >
          <Settings
            style={{ margin: "auto", marginBottom: "3px" }}
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
      <Modal
        isOpen={settingsOpen}
        onRequestClose={() => setSettingsOpen(false)}
      >
        <button
          onClick={() => {
            setSettingsOpen(false);
          }}
          className={tw`p-2 -ml-3`}
        >
          <X />
        </button>
        {currentRoom ? (
          <>
            <label
              className={tw`flex items-center my-8`}
              htmlFor="auto-speaker"
            >
              <input
                checked={!currentRoom.autoSpeaker}
                onChange={(e) => {
                  setCurrentRoom((cr) =>
                    !cr
                      ? cr
                      : {
                          ...cr,
                          autoSpeaker: !e.target.checked,
                        }
                  );
                  wsend({
                    op: "set_auto_speaker",
                    d: { value: !e.target.checked },
                  });
                }}
                id="auto-speaker"
                type="checkbox"
              />
              <span className={tw`ml-2`}>require permission to speak</span>
            </label>
            {currentRoom.isPrivate ? (
              <Button
                onClick={() => {
                  renameRoomAndMakePublic(currentRoom.name);
                  setSettingsOpen(false);
                }}
              >
                make room public
              </Button>
            ) : (
              <Button
                onClick={() => {
                  renameRoomAndMakePrivate(currentRoom.name);
                  setSettingsOpen(false);
                }}
              >
                make room private
              </Button>
            )}
          </>
        ) : null}
      </Modal>
      <div
        style={{ height: fullscreenChatOpen ? "100%" : undefined }}
        className={tw`${
          fullscreenChatOpen
            ? `fixed top-0 left-0 right-0 flex-col flex`
            : `sticky`
        } bottom-0 w-full`}
      >
        {fullscreenChatOpen ? null : children}
        <RoomChat sidebar={false} />
        <div
          style={{
            borderTop: "1px solid #808080",
            backgroundColor: "#262626",
            padding: "0 var(--container-paddding)",
          }}
          className={tw`w-full mt-auto`}
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
