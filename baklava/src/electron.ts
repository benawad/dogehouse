import {
  BrowserWindow,
  app,
  systemPreferences,
  ipcMain,
  globalShortcut,
  shell,
} from "electron";
import iohook from "iohook";
import { HandleVoiceTray, RegisterKeybinds } from "./util";
import { ALLOWED_HOSTS } from "./constants";
let mainWindow: BrowserWindow;

export const __prod__ = app.isPackaged;
const instanceLock = app.requestSingleInstanceLock();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1000,
    autoHideMenuBar: true,
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

  // starting the custom voice menu handler
  HandleVoiceTray(mainWindow);

  // graceful exiting
  mainWindow.on("closed", () => {
    globalShortcut.unregisterAll();
    iohook.stop();
    iohook.unload();
    mainWindow.destroy();
  });

  // handling external links
  const handleLinks = (event: any, url: string) => {
    let urlObj = new URL(url);
    let urlHost = urlObj.hostname;
    if (!ALLOWED_HOSTS.includes(urlHost)) {
      event.preventDefault();
      shell.openExternal(url);
    } else {
      if (urlHost == ALLOWED_HOSTS[3] && urlObj.pathname !== "/login" && urlObj.pathname !== "/session") {
        event.preventDefault();
        shell.openExternal(url);
      }
    }
  };
  mainWindow.webContents.on("new-window", handleLinks);
  mainWindow.webContents.on("will-navigate", handleLinks);
}

if (!instanceLock) {
  app.quit();
} else {
  app.on("ready", () => {
    createWindow();
  });
  app.on("second-instance", (event, argv, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("window-all-closed", () => {
  app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
