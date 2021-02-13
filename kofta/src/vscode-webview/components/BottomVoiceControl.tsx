import { useAtom } from "jotai";
import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { currentRoomAtom, myCurrentRoomInfoAtom } from "../atoms";
import { PhoneMissed, UserPlus, Mic, MicOff, X, Settings } from "react-feather";
import { Footer } from "./Footer";
import { renameRoomAndMakePublic } from "../../webrtc/utils/renameRoomAndMakePublic";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface BottomVoiceControlProps {}

const iconSize = 24;
const iconColor = "#8C8C8C";
const buttonStyle = { padding: "10px", color: "#8C8C8C", fontSize: 14 };

export const BottomVoiceControl: React.FC<BottomVoiceControlProps> = ({
  children,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const { muted, set } = useMuteStore();
  const [{ canSpeak, isCreator }] = useAtom(myCurrentRoomInfoAtom);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const buttons = [];

  if (currentRoom) {
    buttons.push(
      <button
        style={buttonStyle}
        key="leave-room"
        onClick={() => {
          wsend({ op: "leave_room", d: {} });
          if (location.pathname.startsWith("/room")) {
            history.push("/");
          }
        }}
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
        key="invite"
        onClick={() => {
          wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
          history.push("/invite");
        }}
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
            ) : null}
          </>
        ) : null}
      </Modal>
      <div className={tw`sticky bottom-0`}>
        {children}
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
