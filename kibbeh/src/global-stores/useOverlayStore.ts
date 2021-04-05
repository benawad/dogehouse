import create from "zustand";
import { combine } from "zustand/middleware";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

const overlayAppTitleKey = "@overlay/app_title";

const getDefaultValues = () => {
  try {
    const v = localStorage.getItem(overlayAppTitleKey);
    if (isElectron()) {
      ipcRenderer.send(overlayAppTitleKey, v || "");
    }
    return {
      appTitle: v || "",
    };
  } catch {
    return {
      appTitle: "",
    };
  }
};

export const useOverlayStore = create(
  combine(getDefaultValues(), (set) => ({
    setData: (x: { appTitle: string }) => {
      try {
        localStorage.setItem(overlayAppTitleKey, x.appTitle);
        if (isElectron()) {
          ipcRenderer.send(overlayAppTitleKey, x.appTitle);
        }
      } catch {}

      set(x);
    },
  }))
);
