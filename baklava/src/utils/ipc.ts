import {
    ipcMain,
    BrowserWindow,
} from "electron";

export async function startIPCHandler(mainWindow: BrowserWindow, overlayWindow: BrowserWindow) {
    ipcMain.on("@overlay/shouldRunIPC", () => {
        if (overlayWindow) {
            overlayWindow.webContents.send("@overlay/shouldRunIPC", true);
        }
    })
    ipcMain.on("@overlay/start_ipc", () => {
        mainWindow.webContents.send("@overlay/start_ipc", true)
    })
}