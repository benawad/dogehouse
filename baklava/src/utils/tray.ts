import {
    ipcMain,
    BrowserWindow,
    Menu,
    Tray
} from "electron";
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
    ];


    // create system tray
    tray.setToolTip("Taking voice conversations to the moon 🚀");
    tray.on("click", () => {
        mainWindow.focus();
    });

    let contextMenu = Menu.buildFromTemplate([TRAY_MENU[0]]);
    tray.setContextMenu(contextMenu);

    ipcMain.on("@voice/active", (event, isActive: boolean) => {
        if (isActive) {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[1], TRAY_MENU[0]]);
        } else {
            contextMenu = Menu.buildFromTemplate([TRAY_MENU[0]]);
        }
        tray.setContextMenu(contextMenu);
    });
}