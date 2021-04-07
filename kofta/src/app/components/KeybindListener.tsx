import React, { useMemo, useEffect } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import { wsend } from "../../createWebsocket";
import {
  useKeyMapStore,
  REQUEST_TO_SPEAK_KEY,
  MUTE_KEY,
  CHAT_KEY,
  INVITE_KEY,
} from "../../webrtc/stores/useKeyMapStore";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { useHistory } from "react-router-dom";
import { modalConfirm } from "../components/ConfirmModal";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface KeybindListenerProps { }

export const KeybindListener: React.FC<KeybindListenerProps> = ({ }) => {
  return <>{isElectron() ? <ListenerElectron /> : <ListenerBrowser />}</>;
};

function ListenerElectron() {
  const { keyMap } = useKeyMapStore();
  const [toggleOpen] = useRoomChatStore((s) => [
    s.toggleOpen,
    s.newUnreadMessages,
  ]);
  const history = useHistory();
  useEffect(() => {
    // keybind event functions
    const REQUEST_TO_SPEAK_KEY_FUNC = async (event: any, args: any) => {
      modalConfirm("Would you like to ask to speak?", () => {
        wsend({ op: "ask_to_speak", d: {} });
      });
    };
    const MUTE_KEY_FUNC = async (event: any, args: any) => {
      const { muted, setMute } = useMuteStore.getState();
      wsend({
        op: "mute",
        d: { value: !muted },
      });
      setMute(!muted);
    };
    const INVITE_KEY_FUNC = async (event: any, args: any) => {
      wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
      history.push("/invite");
    };
    const PTT_STATUS_CHANGE_FUNC = async (event: any, status: boolean) => {
      const { setMute } = useMuteStore.getState();
      const mute = status;
      wsend({
        op: "mute",
        d: { value: mute },
      });
      setMute(mute);
    };
    const CHAT_KEY_FUNC = async (event: any, args: any) => {
      toggleOpen();
    };

    //Subscribing to keybind events
    ipcRenderer.on(REQUEST_TO_SPEAK_KEY, REQUEST_TO_SPEAK_KEY_FUNC);
    ipcRenderer.on(MUTE_KEY, MUTE_KEY_FUNC);
    ipcRenderer.on(INVITE_KEY, INVITE_KEY_FUNC);
    ipcRenderer.on("@voice/ptt_status_change", PTT_STATUS_CHANGE_FUNC);
    ipcRenderer.on(CHAT_KEY, CHAT_KEY_FUNC);

    return function cleanup() {
      //Unsubscribing from keybind events
      ipcRenderer.removeListener(
        REQUEST_TO_SPEAK_KEY,
        REQUEST_TO_SPEAK_KEY_FUNC
      );
      ipcRenderer.removeListener(MUTE_KEY, MUTE_KEY_FUNC);
      ipcRenderer.removeListener(INVITE_KEY, INVITE_KEY_FUNC);
      ipcRenderer.removeListener("@voice/ptt_status_change", PTT_STATUS_CHANGE_FUNC);
      ipcRenderer.removeListener(CHAT_KEY, CHAT_KEY_FUNC);
    };
  }, [history, toggleOpen]);
  return null;
}

function ListenerBrowser() {
  const { keyMap } = useKeyMapStore();
  const toggleOpen = useRoomChatStore((s) => s.toggleOpen);
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
        [history, toggleOpen]
      )}
    />
  );
}
