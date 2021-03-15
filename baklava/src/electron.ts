import {
  BrowserWindow,
  app,
  systemPreferences,
  ipcMain,
  globalShortcut,
} from "electron";
import iohook from "iohook";
import { RegisterKeybinds } from "./util";

let mainWindow: BrowserWindow;
export const __prod__ = app.isPackaged;
const instanceLock = app.requestSingleInstanceLock();

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

  // graceful exiting
  mainWindow.on("closed", () => {
    globalShortcut.unregisterAll();
    iohook.stop();
    iohook.unload();
    mainWindow.destroy();
  });
}

if (!instanceLock) {
  app.quit()
} else {
  app.on("ready", () => {
    createWindow();
  });
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

app.on("window-all-closed", () => {
  app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
