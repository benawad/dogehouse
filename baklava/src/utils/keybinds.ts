import {
    ipcMain,
    globalShortcut,
} from "electron";
import {
    CHAT_KEY,
    INVITE_KEY,
    MUTE_KEY,
    PTT_KEY,
    REQUEST_TO_SPEAK_KEY,
    OVERLAY_KEY,
    isMac,
} from "../constants";
import { overlayWindow } from "electron-overlay-window";
import { createOverlay } from "./overlay";
import { startIPCHandler } from "./ipc";
import { bWindowsType } from "../types";
import globkey from 'globkey';

export let CURRENT_REQUEST_TO_SPEAK_KEY = "Control+8";
export let CURRENT_INVITE_KEY = "Control+7";
export let CURRENT_MUTE_KEY = "Control+m";
export let CURRENT_CHAT_KEY = "Control+9";
export let CURRENT_OVERLAY_KEY = "Control+Tab";
export let CURRENT_PTT_KEY = ["0", "Control"];
export let CURRENT_PTT_KEY_STRING = "0,control"

export let CURRENT_APP_TITLE = "";

let PREV_PTT_STATUS = false;

export function RegisterKeybinds(bWindows: bWindowsType) {
    ipcMain.on(REQUEST_TO_SPEAK_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_REQUEST_TO_SPEAK_KEY)) {
            globalShortcut.unregister(CURRENT_REQUEST_TO_SPEAK_KEY);
        }
        CURRENT_REQUEST_TO_SPEAK_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            bWindows.main.webContents.send(REQUEST_TO_SPEAK_KEY, keyCode);
        })
    });
    ipcMain.on(INVITE_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_INVITE_KEY)) {
            globalShortcut.unregister(CURRENT_INVITE_KEY);
        }
        CURRENT_INVITE_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            bWindows.main.webContents.send(INVITE_KEY, keyCode);
        })
    });
    ipcMain.on(MUTE_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_MUTE_KEY)) {
            globalShortcut.unregister(CURRENT_MUTE_KEY);
        }
        CURRENT_MUTE_KEY = keyCode
        globalShortcut.register(keyCode, () => {
            bWindows.main.webContents.send(MUTE_KEY, keyCode);
        })
    });
    ipcMain.on(CHAT_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_CHAT_KEY)) {
            globalShortcut.unregister(CURRENT_CHAT_KEY);
        }
        CURRENT_CHAT_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            bWindows.main.webContents.send(CHAT_KEY, keyCode);
        })
    });
    ipcMain.on(PTT_KEY, (event, keyCode: string) => {
        if (keyCode.includes("+")) {
            let keys = keyCode.split("+");
            CURRENT_PTT_KEY = keys;
        } else {
            CURRENT_PTT_KEY = [keyCode];
        }
        CURRENT_PTT_KEY = CURRENT_PTT_KEY.sort();
        CURRENT_PTT_KEY_STRING = CURRENT_PTT_KEY.join().toLowerCase();
    });

    ipcMain.on(OVERLAY_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_OVERLAY_KEY)) {
            globalShortcut.unregister(CURRENT_OVERLAY_KEY);
        }
        CURRENT_OVERLAY_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            if (!isMac) {
                if (bWindows.overlay) {
                    if (!bWindows.overlay.isVisible()) {
                        bWindows.overlay.show();
                        bWindows.main.webContents.send("@overlay/start_ipc", true);
                    } else {
                        bWindows.overlay.hide();
                        bWindows.main.webContents.send("@overlay/start_ipc", true);
                    }
                } else {
                    bWindows.overlay = createOverlay(CURRENT_APP_TITLE, overlayWindow);
                    startIPCHandler(bWindows.main, bWindows.overlay);
                }
            }
        })
    });

    ipcMain.on("@overlay/app_title", (event, appTitle: string) => {
        CURRENT_APP_TITLE = appTitle;
    })

    globkey.raw((keypair: string[]) => {
        keypair.forEach(key => {
            let i = keypair.indexOf(key);
            keypair[i] = keypair[i].replace("L", "");
            keypair[i] = keypair[i].replace("R", "");
            keypair[i] = keypair[i].replace("Key", "");
        });
        keypair = keypair.sort();
        let ks = keypair.join().toLowerCase();
        let PTT = ks !== CURRENT_PTT_KEY_STRING;
        if (PREV_PTT_STATUS !== PTT) {
            bWindows.main.webContents.send("@voice/ptt_status_change", PTT);
            PREV_PTT_STATUS = PTT;
        }
    })
}