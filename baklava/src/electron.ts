import {
  BrowserWindow,
  app,
  systemPreferences,
  ipcMain,
  globalShortcut,
  Tray,
  Menu,
  shell,
} from "electron";
import iohook from "iohook";
import { autoUpdater } from "electron-updater";
import { RegisterKeybinds } from "./util";
import { ALLOWED_HOSTS } from "./constants";
import url from "url";
import path from "path";

let mainWindow: BrowserWindow;
let tray: Tray;
export const __prod__ = app.isPackaged;
const instanceLock = app.requestSingleInstanceLock();

let splash;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false
  });

  splash = new BrowserWindow({
    width: 810,
    height: 610,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
  });
  splash.loadURL(
    url.format({
      pathname: path.join(`${__dirname}`, "../splash-screen.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // crashes on mac
  // systemPreferences.askForMediaAccess("microphone");
  if (!__prod__) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadURL(
    __prod__ ? `https://dogehouse.tv/` : "http://localhost:3000/"
  );

  setTimeout(
    () =>
      mainWindow.once("ready-to-show", () => {
        splash.destroy();
        mainWindow.show();
      }),
    2000
  );

  ipcMain.on("request-mic", async (event, _serviceName) => {
    const isAllowed: boolean = await systemPreferences.askForMediaAccess(
      "microphone"
    );
    event.returnValue = isAllowed;
  });

  // registers global keybinds
  RegisterKeybinds(mainWindow);

  // create system tray
  tray = new Tray("./icons/icon.ico");
  tray.setToolTip("Taking voice conversations to the moon 🚀");
  tray.on("click", () => {
    mainWindow.focus();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Quit Dogehouse",
      click: () => {
        mainWindow.close();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);

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
      if (urlHost == ALLOWED_HOSTS[3] && urlObj.pathname !== "/login") {
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
    autoUpdater.checkForUpdatesAndNotify();
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
