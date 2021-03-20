import {
    ipcMain,
    BrowserWindow,
} from "electron";

export async function startIPCHandler(mainWindow: BrowserWindow, overlayWindow: BrowserWindow) {
    ipcMain.on("@overlay/start_ipc", (event, data) => {
        if (overlayWindow) {
            mainWindow.webContents.send("@overlay/start_ipc", true);
        }
    });
    ipcMain.on("@overlay/overlayData", (event, data) => {
        if (overlayWindow) {
            overlayWindow.webContents.send("@overlay/overlayData", data);
        }
    });
}