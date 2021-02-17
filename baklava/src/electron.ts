import { BrowserWindow, app, systemPreferences, ipcMain } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  console.log(systemPreferences.getMediaAccessStatus("microphone"));
  mainWindow.loadURL(`https://dogehouse.tv/`);

  ipcMain.on("request-mic", async (event, serviceName) => {
    const isAllowed: boolean = await systemPreferences.askForMediaAccess(
      "microphone"
    );
    event.returnValue = isAllowed;
  });
  mainWindow.on("closed", () => mainWindow.destroy());
}

app.on("ready", () => {
  createWindow();
});
app.on("window-all-closed", () => {
  app.quit();

  if (process.platform !== "darwin") {
  }
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
