import {
  BrowserWindow,
  app,
  systemPreferences,
  ipcMain,
  globalShortcut,
  shell,
  Tray,
  Menu,
} from "electron";
import iohook from "iohook";
import { autoUpdater } from "electron-updater";
import { RegisterKeybinds } from "./utils/keybinds";
import { HandleVoiceTray } from "./utils/tray";
import { ALLOWED_HOSTS, isMac, MENU_TEMPLATE } from "./constants";
import url from "url";
import path from "path";
import { StartNotificationHandler } from "./utils/notifications";
import activeWin from 'active-win'

let mainWindow: BrowserWindow;
let tray: Tray;
let menu: Menu;
let splash;

export const __prod__ = true; // app.isPackaged
const instanceLock = app.requestSingleInstanceLock();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  });

  splash = new BrowserWindow({
    width: 810,
    height: 610,
    frame: false
  });
  splash.loadURL(
    url.format({
      pathname: path.join(`${__dirname}`, "../resources/splash/splash-screen.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  // applying custom menu
  menu = Menu.buildFromTemplate(MENU_TEMPLATE);
  Menu.setApplicationMenu(menu);

  // applying custom tray
  tray = new Tray(path.join(__dirname, `../icons/tray.png`));

  if (!__prod__) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadURL(
    __prod__ ? `https://twitter.com/` : "http://localhost:3000/"
  );

  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 2500);
  }),
    // crashes on mac
    // systemPreferences.askForMediaAccess("microphone");
    ipcMain.on("request-mic", async (event, _serviceName) => {
      const isAllowed: boolean = await systemPreferences.askForMediaAccess(
        "microphone"
      );
      event.returnValue = isAllowed;
    });
  if (!isMac) {
    mainWindow.webContents.send("@alerts/permissions", true);
  }

  // registers global keybinds
  RegisterKeybinds(mainWindow);

  // starting the custom voice menu handler
  HandleVoiceTray(mainWindow, tray);

  // starting the noti handler
  StartNotificationHandler();

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
      if (
        urlHost == ALLOWED_HOSTS[3] &&
        urlObj.pathname !== "/login" &&
        urlObj.pathname !== "/session" &&
        urlObj.pathname !== "/sessions/two-factor"
      ) {
        event.preventDefault();
        shell.openExternal(url);
      }
    }
  };
  mainWindow.webContents.on("new-window", handleLinks);
  mainWindow.webContents.on("will-navigate", handleLinks);
}

if (!instanceLock) {
  if (process.env.hotReload) {
    app.relaunch();
  }
  app.quit();
} else {
  app.on("ready", () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
    mainWindow.on('blur', () => {
      (async () => {
        console.log(await activeWin());
      })();
    })
  });
  app.on("second-instance", (event, argv, workingDirectory) => {
    if (mainWindow) {
      if (process.env.hotReload) return mainWindow.close();
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
