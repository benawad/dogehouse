import { useAtom } from "jotai";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { tw } from "twind";
import { wsend } from "../../createWebsocket";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { renameRoomAndMakePublic } from "../../webrtc/utils/renameRoomAndMakePublic";
import { currentRoomAtom, meAtom, myCurrentRoomInfoAtom } from "../atoms";
import { Button } from "./Button";
import { Footer } from "./Footer";

interface BottomVoiceControlProps {}

export const BottomVoiceControl: React.FC<BottomVoiceControlProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const [currentRoom, setCurrentRoom] = useAtom(currentRoomAtom);
  const { muted, set } = useMuteStore();
  const [me] = useAtom(meAtom);
  const [{ canSpeak, isCreator }] = useAtom(myCurrentRoomInfoAtom);

  return (
    <div
      style={{ backgroundColor: "var(--vscode-dropdown-border)" }}
      className={tw`p-4 sticky bottom-0 w-full mt-auto`}
    >
      {currentRoom ? (
        <>
          {isCreator ? (
            <label
              className={tw`flex items-center mb-8`}
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
              <span className={tw`ml-2`}>
                require audience to ask permission to speak
              </span>
            </label>
          ) : null}
          {isCreator && currentRoom.isPrivate ? (
            <div className={tw`mb-6`}>
              <Button
                onClick={() => {
                  renameRoomAndMakePublic(currentRoom.name);
                }}
              >
                make room public
              </Button>
            </div>
          ) : null}
          {!me || isCreator || canSpeak ? null : me.id in
              currentRoom.raiseHandMap &&
            currentRoom.raiseHandMap[me.id] !== 1 ? (
            <div className={tw`mb-6`}>
              you can only ask to speak once per room
            </div>
          ) : (
            <div className={tw`mb-6`}>
              <Button
                onClick={() => {
                  wsend({ op: "ask_to_speak", d: {} });
                }}
              >
                ask to speak
              </Button>
            </div>
          )}
          <div className={tw`mb-6`}>
            <Button
              onClick={() => {
                wsend({ op: "leave_room", d: {} });
                if (location.pathname.startsWith("/room")) {
                  history.push("/");
                }
              }}
            >
              leave room
            </Button>
          </div>
          {isCreator || canSpeak ? (
            <Button
              onClick={() => {
                wsend({
                  op: "mute",
                  d: { value: !muted },
                });
                set({ muted: !muted });
              }}
            >
              {muted ? "unmute" : "mute"}
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
};
