import {
    ipcMain,
    globalShortcut,
    BrowserWindow
} from "electron";

export const __prod__ = process.env.NODE_ENV === "production";
export const REQUEST_TO_SPEAK_KEY = "@keybind/invite";
export const INVITE_KEY = "@keybind/invite";
export const MUTE_KEY = "@keybind/mute";
export const CHAT_KEY = "@keybind/chat";
export const PTT_KEY = "@keybind/ptt";
export let CURRENT_REQUEST_TO_SPEAK_KEY = "Control+8";
export let CURRENT_INVITE_KEY = "Control+7";
export let CURRENT_MUTE_KEY = "Control+m";
export let CURRENT_CHAT_KEY = "Control+9";
export let CURRENT_PTT_KEY = "Control+0";

export function RegisterKeybinds(mainWindow: BrowserWindow) {
    ipcMain.on(REQUEST_TO_SPEAK_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_REQUEST_TO_SPEAK_KEY)) {
            globalShortcut.unregister(CURRENT_REQUEST_TO_SPEAK_KEY);
        }
        CURRENT_REQUEST_TO_SPEAK_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            mainWindow.webContents.send(REQUEST_TO_SPEAK_KEY, keyCode);
        })
    });
    ipcMain.on(INVITE_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_INVITE_KEY)) {
            globalShortcut.unregister(CURRENT_INVITE_KEY);
        }
        CURRENT_INVITE_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            mainWindow.webContents.send(INVITE_KEY, keyCode);
        })
    });
    ipcMain.on(MUTE_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_MUTE_KEY)) {
            globalShortcut.unregister(CURRENT_MUTE_KEY);
        }
        CURRENT_MUTE_KEY = keyCode
        globalShortcut.register(keyCode, () => {
            mainWindow.webContents.send(MUTE_KEY, keyCode);
        })
    });
    ipcMain.on(CHAT_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_CHAT_KEY)) {
            globalShortcut.unregister(CURRENT_CHAT_KEY);
        }
        CURRENT_CHAT_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            mainWindow.webContents.send(CHAT_KEY, keyCode);
        })
    });
    ipcMain.on(PTT_KEY, (event, keyCode) => {
        if (globalShortcut.isRegistered(CURRENT_PTT_KEY)) {
            globalShortcut.unregister(CURRENT_PTT_KEY);
        }
        CURRENT_PTT_KEY = keyCode;
        globalShortcut.register(keyCode, () => {
            mainWindow.webContents.send(PTT_KEY, keyCode);
        })
    });
}
