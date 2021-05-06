import { KeyMap } from "react-hotkeys";
import create from "zustand";
import { combine } from "zustand/middleware";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export const REQUEST_TO_SPEAK_KEY = "@keybind/invite";
export const INVITE_KEY = "@keybind/invite";
export const MUTE_KEY = "@keybind/mute";
export const DEAF_KEY = "@keybind/deafen";
export const CHAT_KEY = "@keybind/chat";
export const PTT_KEY = "@keybind/ptt";
export const OVERLAY_KEY = "@keybind/overlay";

function getKeybind(actionKey: string, defaultKeybind: string) {
  let v = "";
  try {
    v = localStorage.getItem(actionKey) || "";
  } catch { }
  if (isElectron()) {
    ipcRenderer.send(actionKey, v || defaultKeybind);
  }
  return v || defaultKeybind;
}

function getRequestToSpeakKeybind() {
  return getKeybind(REQUEST_TO_SPEAK_KEY, "Control+8");
}

function getInviteKeybind() {
  return getKeybind(INVITE_KEY, "Control+7");
}

function getMuteKeybind() {
  return getKeybind(MUTE_KEY, "Control+m");
}

function getDeafKeybind() {
  return getKeybind(DEAF_KEY, "Control+1");
}

function getChatKeybind() {
  return getKeybind(CHAT_KEY, "Control+9");
}

function getPTTKeybind() {
  return getKeybind(PTT_KEY, "Control+0");
}

function getOverlayKeybind() {
  return getKeybind(OVERLAY_KEY, "Control+2");
}

const keyMap: KeyMap = {
  REQUEST_TO_SPEAK: getRequestToSpeakKeybind(),
  INVITE: getInviteKeybind(),
  MUTE: getMuteKeybind(),
  DEAF: getDeafKeybind(),
  CHAT: getChatKeybind(),
  OVERLAY: getOverlayKeybind(),
  PTT: [
    { sequence: getPTTKeybind(), action: "keydown" },
    { sequence: getPTTKeybind(), action: "keyup" },
  ],
};

const keyNames: KeyMap = {
  REQUEST_TO_SPEAK: getRequestToSpeakKeybind(),
  INVITE: getInviteKeybind(),
  MUTE: getMuteKeybind(),
  DEAF: getDeafKeybind(),
  CHAT: getChatKeybind(),
  PTT: getPTTKeybind(),
  OVERLAY: getOverlayKeybind(),
};

export const useKeyMapStore = create(
  combine(
    {
      keyMap,
      keyNames,
    },
    (set) => ({
      setRequestToSpeakKeybind: (id: string) => {
        try {
          localStorage.setItem(REQUEST_TO_SPEAK_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(REQUEST_TO_SPEAK_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, REQUEST_TO_SPEAK: id },
          keyNames: { ...x.keyNames, REQUEST_TO_SPEAK: id },
        }));
      },
      setInviteKeybind: (id: string) => {
        try {
          localStorage.setItem(INVITE_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(INVITE_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, INVITE: id },
          keyNames: { ...x.keyNames, INVITE: id },
        }));
      },
      setMuteKeybind: (id: string) => {
        try {
          localStorage.setItem(MUTE_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(MUTE_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, MUTE: id },
          keyNames: { ...x.keyNames, MUTE: id },
        }));
      },
      setDeafKeybind: (id: string) => {
        try {
          localStorage.setItem(DEAF_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(DEAF_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, DEAF: id },
          keyNames: { ...x.keyNames, DEAF: id },
        }));
      },
      setChatKeybind: (id: string) => {
        try {
          localStorage.setItem(CHAT_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(CHAT_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, CHAT: id },
          keyNames: { ...x.keyNames, CHAT: id },
        }));
      },
      setOverlayKeybind: (id: string) => {
        try {
          localStorage.setItem(OVERLAY_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(OVERLAY_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: { ...x.keyMap, OVERLAY: id },
          keyNames: { ...x.keyNames, OVERLAY: id },
        }));
      },
      setPTTKeybind: (id: string) => {
        try {
          localStorage.setItem(PTT_KEY, id);
          if (isElectron()) {
            ipcRenderer.send(PTT_KEY, id);
          }
        } catch { }
        set((x) => ({
          keyMap: {
            ...x.keyMap,
            PTT: [
              { sequence: id, action: "keydown" },
              { sequence: id, action: "keyup" },
            ],
          },
          keyNames: { ...x.keyNames, PTT: id },
        }));
      },
    })
  )
);
