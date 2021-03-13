import React, { useMemo, useEffect } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { wsend } from "../../createWebsocket";
import { useKeyMapStore, REQUEST_TO_SPEAK_KEY, MUTE_KEY, CHAT_KEY, INVITE_KEY } from "../../webrtc/stores/useKeyMapStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { useHistory } from "react-router-dom";
import { modalConfirm } from "../components/ConfirmModal";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require('electron').ipcRenderer
}

interface KeybindListenerProps { }

export const KeybindListener: React.FC<KeybindListenerProps> = ({ }) => {

  return (
    <>
      {isElectron() ? <ListenerElectron /> : <ListenerBrowser />}
    </>
  )

};

function ListenerElectron() {
  const { keyMap } = useKeyMapStore();
  const [toggleOpen, newUnreadMessages] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
  ]);
  const history = useHistory();
  useEffect(() => {
    ipcRenderer.on(REQUEST_TO_SPEAK_KEY, async (event: any, args: any) => {
      modalConfirm("Would you like to ask to speak?", () => {
        wsend({ op: "ask_to_speak", d: {} });
      });
    })
    ipcRenderer.on(MUTE_KEY, async (event: any, args: any) => {
      const { muted, setMute } = useMuteStore.getState();
      wsend({
        op: "mute",
        d: { value: !muted },
      });
      setMute(!muted);
    })
    ipcRenderer.on(INVITE_KEY, async (event: any, args: any) => {
      wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
      history.push("/invite");
    })
    ipcRenderer.on(CHAT_KEY, async (event: any, args: any) => {
      toggleOpen();
    })
  }, []);
  return (
    <GlobalHotKeys
      allowChanges={true}
      keyMap={keyMap}
      handlers={useMemo(
        () => ({
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
        }),
        []
      )}
    />
  )
}


function ListenerBrowser() {
  const { keyMap } = useKeyMapStore();
  const [toggleOpen, newUnreadMessages] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
  ]);
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
        []
      )}
    />
  );
}
