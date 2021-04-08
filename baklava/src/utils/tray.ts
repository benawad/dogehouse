import {
    ipcMain,
    BrowserWindow,
    Menu,
    Tray,
    app
} from "electron";
import { autoUpdater } from "electron-updater";
import { MUTE_KEY } from "../constants";
import { RPC_RUNNING, startRPC, stopRPC } from "./rpc";

let voiceActive = false;

export async function HandleVoiceTray(mainWindow: BrowserWindow, tray: Tray) {
    let TRAY_MENU: any = [
        {
            label: "Quit Dogehouse",
            click: () => {
                mainWindow.close();
            },
        },
        {
            label: 'Toggle Mute',
            click: () => {
                mainWindow.webContents.send(MUTE_KEY, "Toggled mute from Menu");
            }
        },
        {
            label: "Check For Updates",
            click: () => {
                autoUpdater.checkForUpdatesAndNotify();
            },
        },
        {
            label: "Toggle Discord RPC",
            click: () => {
                if (RPC_RUNNING) {
                    stopRPC();
                } else {
                    startRPC()
                }
                TRAY_MENU[3].checked = RPC_RUNNING;
                let contextMenu = Menu.buildFromTemplate([TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
                if (voiceActive) {
                    contextMenu = Menu.buildFromTemplate([TRAY_MENU[1], TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
                } else {
                    contextMenu = Menu.buildFromTemplate([TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
                }
                tray.setContextMenu(contextMenu);
                tray.setContextMenu(contextMenu)
            },
            checked: RPC_RUNNING
        },
    ];

    let seperator = { type: 'separator' };

    // create system tray
    tray.setToolTip("Taking voice conversations to the moon 🚀");
    tray.on("click", () => {
        mainWindow.focus();
    });

    let contextMenu = Menu.buildFromTemplate([TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
    tray.setContextMenu(contextMenu);

    ipcMain.on("@room/joined", (event, isActive: boolean) => {
        voiceActive = isActive
        if (voiceActive) {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[1], TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
        } else {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[3], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
        }
        tray.setContextMenu(contextMenu);
    });
}
