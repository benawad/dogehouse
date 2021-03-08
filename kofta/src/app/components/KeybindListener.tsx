import React, { useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { wsend } from "../../createWebsocket";
import { useKeyMapStore } from "../../webrtc/stores/useKeyMapStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";

interface KeybindListenerProps {}

export const KeybindListener: React.FC<KeybindListenerProps> = ({}) => {
  const { keyMap } = useKeyMapStore();
	const [toggleOpen, newUnreadMessages] = useRoomChatStore((s) => [
		s.toggleOpen,
		s.newUnreadMessages,
	]);

  return (
    <GlobalHotKeys
      allowChanges={true}
      keyMap={keyMap}
      handlers={useMemo(
        () => ({
          MUTE: () => {
            const { muted, setMute } = useMuteStore.getState();
            wsend({
              op: "mute",
              d: { value: !muted },
            });
            setMute(!muted);
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
        []
      )}
    />
  );
};
