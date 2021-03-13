import {
  BrowserWindow,
  app,
  systemPreferences,
  ipcMain,
  globalShortcut
} from "electron";
import { __prod__ } from "./constants";
import { RegisterKeybinds } from "./util";
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
  // crashes on mac
  // systemPreferences.askForMediaAccess("microphone");
  if (!__prod__) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadURL(
    __prod__ ? `https://dogehouse.tv/` : "http://localhost:3000/"
  );

  ipcMain.on("request-mic", async (event, _serviceName) => {
    const isAllowed: boolean = await systemPreferences.askForMediaAccess(
      "microphone"
    );
    event.returnValue = isAllowed;
  });

  // registers global keybinds
  RegisterKeybinds(mainWindow);
  mainWindow.on("closed", () => {
    globalShortcut.unregisterAll();
    mainWindow.destroy()
  });
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
