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
import i18n from "i18next";
import Backend from "i18next-node-fs-backend";
import { autoUpdater } from "electron-updater";
import { RegisterKeybinds } from "./utils/keybinds";
import { HandleVoiceTray } from "./utils/tray";
import { ALLOWED_HOSTS, isLinux, isMac, MENU_TEMPLATE } from "./constants";
import url from "url";
import path from "path";
import { StartNotificationHandler } from "./utils/notifications";
import { bWindowsType } from "./types";

let mainWindow: BrowserWindow;
let tray: Tray;
let menu: Menu;
let splash;

export let bWindows: bWindowsType;

export const __prod__ = app.isPackaged;
const instanceLock = app.requestSingleInstanceLock();

i18n.use(Backend);

async function localize() {
  await i18n.init({
    lng: app.getLocale(),
    debug: !__prod__,
    backend:{
      // path where resources get loaded from
      loadPath: path.join(__dirname, '../locales/{{lng}}/translate.json'),
    },
    interpolation: {
      escapeValue: false
    },
    saveMissing: true,
    fallbackLng: "en"
  });
}

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
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  splash.loadURL(
    url.format({
      pathname: path.join(
        `${__dirname}`,
        "../resources/splash/splash-screen.html"
      ),
      protocol: "file:",
      slashes: true,
    })
  );
  splash.webContents.on('did-finish-load', () => {
    splash.webContents.send('@locale/text', {
      title: i18n.t('common.title'),
      check: i18n.t('splash.check'),
      download: i18n.t('splash.download'),
      relaunch: i18n.t('splash.relaunch'),
      launch: i18n.t('splash.launch')
    });
  });

  // applying custom menu
  menu = Menu.buildFromTemplate(MENU_TEMPLATE);
  Menu.setApplicationMenu(menu);

  // applying custom tray
  tray = new Tray(path.join(__dirname, `../icons/tray.png`));

  if (!__prod__) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadURL(
    __prod__ ? `https://dogehouse.tv/` : "http://localhost:3000/"
  );

  bWindows = {
    main: mainWindow,
    overlay: undefined,
  };

  // we skip checking for updates in dev, so we need to show the screen ourselves
  if (!__prod__) {
    mainWindow.once("ready-to-show", () => {
      setTimeout(() => {
        splash.destroy();
        mainWindow.show();
      }, 2500);
    });
  }

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
  RegisterKeybinds(bWindows);

  // starting the custom voice menu handler
  HandleVoiceTray(mainWindow, tray);

  // starting the noti handler
  StartNotificationHandler();

  // graceful exiting
  mainWindow.on("closed", () => {
    globalShortcut.unregisterAll();
    if (bWindows.overlay) {
      bWindows.overlay.destroy();
    }
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
    localize().then(() => {
      createWindow();
      if (__prod__) autoUpdater.checkForUpdates();
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

autoUpdater.on('update-available', info => {
  splash.webContents.send('download', info);
});
autoUpdater.on('download-progress', progress => {
  splash.webContents.send('percentage', progress.percent);
  splash.setProgressBar(progress.percent/100);
});
autoUpdater.on('update-downloaded', () => {
  splash.webContents.send('relaunch');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 1000);
});
autoUpdater.on('update-not-available', () => {
  splash.webContents.send('launch');
  mainWindow.once("ready-to-show", () => {
    setTimeout(() => {
      splash.destroy();
      mainWindow.show();
    }, 500);
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) {
    localize().then(() => {
      createWindow();
    })
  }
});
