import React, { useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { wsend } from "../../createWebsocket";
import { useKeyMapStore } from "../../webrtc/stores/useKeyMapStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { useHistory } from "react-router-dom";
import { modalConfirm } from "../components/ConfirmModal";

interface KeybindListenerProps {}

export const KeybindListener: React.FC<KeybindListenerProps> = ({}) => {
  const { keyMap } = useKeyMapStore();
  const [toggleOpen] = useRoomChatStore((s) => [s.toggleOpen]);
  const history = useHistory();

  return (
    <GlobalHotKeys
      allowChanges={true}
      keyMap={keyMap}
      handlers={useMemo(
        () => ({
          REQUEST_TO_SPEAK: () => {
            modalConfirm("Would you like to ask to speak?", () => {
              wsend({ op: "ask_to_speak", d: {} });
            });
          },
          MUTE: () => {
            const { muted, setMute } = useMuteStore.getState();
            wsend({
              op: "mute",
              d: { value: !muted },
            });
            setMute(!muted);
          },
          INVITE: () => {
            wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
            history.push("/invite");
          },
          PTT: (e) => {
            if (!e) return;

            const { setMute } = useMuteStore.getState();
            const mute = e.type === "keyup";
            wsend({
              op: "mute",
              d: { value: mute },
            });
            setMute(mute);
          },
          CHAT: toggleOpen,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      )}
    />
  );
};
