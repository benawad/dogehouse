import {
    ipcMain,
    BrowserWindow,
    Menu,
    Tray
} from "electron";
import { autoUpdater } from "electron-updater";
import { MUTE_KEY } from "../constants";

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
    ];

    let seperator = { type: 'separator' };

    // create system tray
    tray.setToolTip("Taking voice conversations to the moon 🚀");
    tray.on("click", () => {
        mainWindow.focus();
    });

    let contextMenu = Menu.buildFromTemplate([TRAY_MENU[2], seperator, TRAY_MENU[0]]);
    tray.setContextMenu(contextMenu);

    ipcMain.on("@voice/active", (event, isActive: boolean) => {
        if (isActive) {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[1], TRAY_MENU[2], seperator, TRAY_MENU[0]]);
        } else {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[2], seperator, TRAY_MENU[0]]);
        }
        tray.setContextMenu(contextMenu);
    });
}