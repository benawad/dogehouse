import {
    ipcMain,
    globalShortcut,
    BrowserWindow
} from "electron";
import {
    CHAT_KEY,
    INVITE_KEY,
    MUTE_KEY,
    PTT_KEY,
    REQUEST_TO_SPEAK_KEY,
    KEY_TABLE,
    IOHookEvent
} from "./constants";
import ioHook from "iohook";

export let CURRENT_REQUEST_TO_SPEAK_KEY = "Control+8";
export let CURRENT_INVITE_KEY = "Control+7";
export let CURRENT_MUTE_KEY = "Control+m";
export let CURRENT_CHAT_KEY = "Control+9";
export let CURRENT_PTT_KEY = ["Control", "0"];

let PTT_PREV_STATUS = true;
let PTT_STATUS = [
    false,
    false,
]

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
    ipcMain.on(PTT_KEY, (event, keyCode: string) => {
        if (keyCode.includes("+")) {
            let keys = keyCode.split("+");
            CURRENT_PTT_KEY = keys;
            PTT_STATUS.length = 0;
            keys.forEach(() => {
                PTT_STATUS.push(false);
            })
        } else {
            CURRENT_PTT_KEY = [keyCode];
            PTT_STATUS = [false];
        }
    });

    ioHook.on("keydown", (event: IOHookEvent) => {
        if (event.shiftKey) {
            if (CURRENT_PTT_KEY.includes("Shift")) {
                let i = CURRENT_PTT_KEY.indexOf("Shift");
                PTT_STATUS[i] = true;
            }
        } else if (event.altKey) {
            if (CURRENT_PTT_KEY.includes("Alt")) {
                let i = CURRENT_PTT_KEY.indexOf("Alt");
                PTT_STATUS[i] = true;
            }
        } else if (event.ctrlKey) {
            if (CURRENT_PTT_KEY.includes("Control")) {
                let i = CURRENT_PTT_KEY.indexOf("Control");
                PTT_STATUS[i] = true;
            }
        } else if (event.metaKey) {
            if (CURRENT_PTT_KEY.includes("Meta")) {
                let i = CURRENT_PTT_KEY.indexOf("Meta");
                PTT_STATUS[i] = true;
            }
        } else {
            if (CURRENT_PTT_KEY.includes(KEY_TABLE[event.keycode - 1])) {
                let i = CURRENT_PTT_KEY.indexOf(KEY_TABLE[event.keycode - 1]);
                PTT_STATUS[i] = true;
            }
        }
        let PTT = PTT_STATUS.every((key_status) => key_status === true);
        if (PTT != PTT_PREV_STATUS) {
            PTT_PREV_STATUS = PTT;
            mainWindow.webContents.send("PTT_STATUS_CHANGE", !PTT);
        }
    })
    
    ioHook.on("keyup", (event: IOHookEvent) => {
        if (event.shiftKey) {
            if (CURRENT_PTT_KEY.includes("Shift")) {
                let i = CURRENT_PTT_KEY.indexOf("Shift");
                PTT_STATUS[i] = false;
            }
        } else if (event.altKey) {
            if (CURRENT_PTT_KEY.includes("Alt")) {
                let i = CURRENT_PTT_KEY.indexOf("Alt");
                PTT_STATUS[i] = false;
            }
        } else if (event.ctrlKey) {
            if (CURRENT_PTT_KEY.includes("Control")) {
                let i = CURRENT_PTT_KEY.indexOf("Control");
                PTT_STATUS[i] = false;
            }
        } else if (event.metaKey) {
            if (CURRENT_PTT_KEY.includes("Meta")) {
                let i = CURRENT_PTT_KEY.indexOf("Meta");
                PTT_STATUS[i] = false;
            }
        } else {
            if (CURRENT_PTT_KEY.includes(KEY_TABLE[event.keycode - 1])) {
                let i = CURRENT_PTT_KEY.indexOf(KEY_TABLE[event.keycode - 1]);
                PTT_STATUS[i] = false;
            }
        }
        let PTT = PTT_STATUS.every((key_status) => key_status === true);
        if (PTT != PTT_PREV_STATUS) {
            PTT_PREV_STATUS = PTT;
            mainWindow.webContents.send("PTT_STATUS_CHANGE", !PTT);
        }
    });

    ioHook.start();

}