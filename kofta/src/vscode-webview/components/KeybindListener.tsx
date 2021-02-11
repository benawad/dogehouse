import React, { useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { wsend } from "../../createWebsocket";
import { useKeyMapStore } from "../../webrtc/stores/useKeyMapStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";

interface KeybindListenerProps {}

export const KeybindListener: React.FC<KeybindListenerProps> = ({}) => {
  const { keyMap } = useKeyMapStore();

  return (
    <GlobalHotKeys
      key={keyMap.MUTE}
      keyMap={keyMap}
      handlers={useMemo(
        () => ({
          MUTE: () => {
            const { muted, set } = useMuteStore.getState();
            wsend({
              op: "mute",
              d: { value: !muted },
            });
            set({ muted: !muted });
          },
        }),
        []
      )}
    />
  );
};
