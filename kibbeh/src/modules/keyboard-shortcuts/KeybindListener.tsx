import { wrap, Wrapper } from "@dogehouse/kebab";
import isElectron from "is-electron";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import {
  CHAT_KEY,
  INVITE_KEY,
  MUTE_KEY,
  DEAF_KEY,
  REQUEST_TO_SPEAK_KEY,
  useKeyMapStore,
} from "../../global-stores/useKeyMapStore";
import { useMuteStore } from "../../global-stores/useMuteStore";
import { useDeafStore } from "../../global-stores/useDeafStore";
import { modalConfirm } from "../../shared-components/ConfirmModal";
import { setMute } from "../../shared-hooks/useSetMute";
import { setDeaf } from "../../shared-hooks/useSetDeaf";
import { useRoomChatStore } from "../room/chat/useRoomChatStore";
import { WebSocketContext } from "../ws/WebSocketProvider";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

interface KeybindListenerProps {}

function ListenerElectron() {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const toggleOpen = useRoomChatStore((s) => s.toggleOpen);

  useEffect(() => {
    if (!conn) {
      return {} as any;
    }
    const wrapper: Wrapper = wrap(conn);
    // keybind event functions
    const REQUEST_TO_SPEAK_KEY_FUNC = (event: any, args: any) => {
      modalConfirm("Would you like to ask to speak?", () => {
        wrapper.mutation.askToSpeak();
      });
    };
    const MUTE_KEY_FUNC = (event: any, args: any) => {
      const { muted } = useMuteStore.getState();
      setMute(wrapper, !muted);
    };
    const DEAF_KEY_FUNC = (event: any, args: any) => {
      const { deafened } = useDeafStore.getState();
      setDeaf(wrapper, !deafened);
    };
    const INVITE_KEY_FUNC = (event: any, args: any) => {
      push("/invite");
    };
    const PTT_STATUS_CHANGE_FUNC = (event: any, status: boolean) => {
      if (!event) return;
      const mute = status;
      setMute(wrapper, mute);
    };
    const CHAT_KEY_FUNC = (event: any, args: any) => {
      toggleOpen();
    };

    // Subscribing to keybind events
    ipcRenderer.on(REQUEST_TO_SPEAK_KEY, REQUEST_TO_SPEAK_KEY_FUNC);
    ipcRenderer.on(MUTE_KEY, MUTE_KEY_FUNC);
    ipcRenderer.on(DEAF_KEY, DEAF_KEY_FUNC);
    ipcRenderer.on(INVITE_KEY, INVITE_KEY_FUNC);
    ipcRenderer.on("@voice/ptt_status_change", PTT_STATUS_CHANGE_FUNC);
    ipcRenderer.on(CHAT_KEY, CHAT_KEY_FUNC);

    return function cleanup() {
      // bUnsubscribing from keybind events
      ipcRenderer.removeListener(
        REQUEST_TO_SPEAK_KEY,
        REQUEST_TO_SPEAK_KEY_FUNC
      );
      ipcRenderer.removeListener(MUTE_KEY, MUTE_KEY_FUNC);
      ipcRenderer.removeListener(DEAF_KEY, DEAF_KEY_FUNC);
      ipcRenderer.removeListener(INVITE_KEY, INVITE_KEY_FUNC);
      ipcRenderer.removeListener(
        "@voice/ptt_status_change",
        PTT_STATUS_CHANGE_FUNC
      );
      ipcRenderer.removeListener(CHAT_KEY, CHAT_KEY_FUNC);
    };
  }, [conn, push, toggleOpen]);

  return null;
}

function ListenerBrowser() {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const { keyMap } = useKeyMapStore();
  const toggleOpen = useRoomChatStore((s) => s.toggleOpen);
  return (
    <GlobalHotKeys
      allowChanges={true}
      keyMap={keyMap}
      handlers={useMemo(() => {
        if (!conn) {
          return {} as any;
        }
        const wrapper = wrap(conn);
        return {
          REQUEST_TO_SPEAK: () => {
            modalConfirm("Would you like to ask to speak?", () => {
              wrapper.mutation.askToSpeak();
            });
          },
          MUTE: () => {
            const { muted } = useMuteStore.getState();
            setMute(wrapper, !muted);
          },
          DEAF: () => {
            const { deafened } = useDeafStore.getState();
            setDeaf(wrapper, !deafened);
          },
          INVITE: () => {
            // wsend({ op: "fetch_invite_list", d: { cursor: 0 } });
            // @todo
            push("/invite");
          },
          PTT: (e) => {
            if (!e) return;
            const mute = e.type === "keyup";
            setMute(wrapper, mute);
          },
          CHAT: toggleOpen,
        };
      }, [push, toggleOpen, conn])}
    />
  );
}

export const KeybindListener: React.FC<KeybindListenerProps> = ({}) => {
  return <>{isElectron() ? <ListenerElectron /> : <ListenerBrowser />}</>;
};
