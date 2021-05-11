import {
    ipcMain,
    globalShortcut,
    app,
} from "electron";
import {
    CHAT_KEY,
    INVITE_KEY,
    MUTE_KEY,
    PTT_KEY,
    REQUEST_TO_SPEAK_KEY,
    OVERLAY_KEY,
    isMac,
    DEAF_KEY,
} from "../constants";
import { overlayWindow } from "electron-overlay-window";
import { createOverlay } from "./overlay";
import { startOverlayIPCHandler } from "./overlay/ipc";
import { bWindowsType } from "../types";

import globalkey from 'globalkey';
import { stopRPC } from "./rpc";

export let CURRENT_REQUEST_TO_SPEAK_KEY = "Control+8";
export let CURRENT_INVITE_KEY = "Control+7";
export let CURRENT_MUTE_KEY = "Control+m";
export let CURRENT_DEAF_KEY = "Control+1";
export let CURRENT_CHAT_KEY = "Control+9";
export let CURRENT_OVERLAY_KEY = "Control+2";
export let CURRENT_PTT_KEY = ["0", "Control"];
export let CURRENT_PTT_KEY_STRING = "0,control"

export let CURRENT_APP_TITLE = "";

let PREV_PTT_STATUS = false;

export let worker: Worker;

export async function RegisterKeybinds(bWindows: bWindowsType) {
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
    ipcMain.on(DEAF_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_DEAF_KEY)) {
            globalShortcut.unregister(CURRENT_DEAF_KEY);
        }
        CURRENT_DEAF_KEY = keyCode
        globalShortcut.register(keyCode, () => {
            bWindows.main.webContents.send(DEAF_KEY, keyCode);
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
                    startOverlayIPCHandler(bWindows.main, bWindows.overlay);
                }
            }
        })
    });

    ipcMain.on("@overlay/app_title", (event, appTitle: string) => {
        CURRENT_APP_TITLE = appTitle;
    })

    globalkey.start(
        down => {
            down.forEach((key: any) => {
                let i = down.indexOf(key);
                down[i] = down[i].replace("L", "");
                down[i] = down[i].replace("R", "");
                down[i] = down[i].replace("Key", "");
            });
            down = down.sort()
            const keyString = down.join().toLowerCase();
            let PTT = keyString !== CURRENT_PTT_KEY_STRING;
            if (PREV_PTT_STATUS !== PTT) {
                bWindows.main.webContents.send("@voice/ptt_status_change", PTT);
                PREV_PTT_STATUS = PTT;
            }
        },
        up => { }
    );
}

export function exitApp() {
    globalkey.stop();
    stopRPC();
    app.quit();
}
