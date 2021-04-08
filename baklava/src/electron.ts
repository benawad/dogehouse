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
import { RegisterKeybinds, exitApp } from "./utils/keybinds";
import { HandleVoiceTray } from "./utils/tray";
import { ALLOWED_HOSTS, isLinux, isMac, MENU_TEMPLATE } from "./constants";
import path from "path";
import { StartNotificationHandler } from "./utils/notifications";
import { bWindowsType } from "./types";
import electronLogger from 'electron-log';

let mainWindow: BrowserWindow;
let tray: Tray;
let menu: Menu;
let splash: BrowserWindow;

export let bWindows: bWindowsType;

export const __prod__ = app.isPackaged;
const instanceLock = app.requestSingleInstanceLock();
let shouldShowWindow = false;
let windowShowInterval: NodeJS.Timeout;
let skipUpdateTimeout: NodeJS.Timeout;

i18n.use(Backend);

electronLogger.transports.file.level = "debug"
autoUpdater.logger = electronLogger;
// just in case we have to revert to a build
autoUpdater.allowDowngrade = true;

async function localize() {
  await i18n.init({
    lng: app.getLocale(),
    debug: false,
    backend: {
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

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 1000,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
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
    __prod__ ? `https://dogehouse.tv/` : "http://localhost:3000/dash"
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
  } else {
    mainWindow.once("ready-to-show", () => {
      shouldShowWindow = true;
    });
  }

  // crashes on mac only in dev
  // systemPreferences.askForMediaAccess("microphone");
  ipcMain.on("request-mic", async (event, _serviceName) => {
    const isAllowed: boolean = await systemPreferences.askForMediaAccess(
      "microphone"
    );
    event.returnValue = isAllowed;
  });
  if (isMac) {
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
        urlHost == ALLOWED_HOSTS[4] &&
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

  ipcMain.on('@app/version', (event, args) => {
    event.sender.send('@app/version', app.getVersion());
  });
  ipcMain.on('@dogehouse/loaded', (event, doge) => {
    if (doge === "kibbeh") {
      if (isMac) {
        mainWindow.maximize();
      } else {
        mainWindow.setSize(1500, 800, true);
      }
    } else {
      mainWindow.setSize(560, 1000, true);
    }
    mainWindow.center();
  });
}

function createSpalshWindow() {
  splash = new BrowserWindow({
    width: 300,
    height: 410,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  splash.loadFile(path.join(__dirname, "../resources/splash/splash-screen.html"));
  electronLogger.info(`SPLASH PATH: ${path.join(__dirname, "../resources/splash/splash-screen.html")}`)
  splash.webContents.on('did-finish-load', () => {
    splash.webContents.send('@locale/text', {
      title: i18n.t('common.title'),
      check: i18n.t('splash.check'),
      download: i18n.t('splash.download'),
      relaunch: i18n.t('splash.relaunch'),
      launch: i18n.t('splash.launch')
    });
  });
}

if (!instanceLock) {
  if (process.env.hotReload) {
    app.relaunch();
  }
  exitApp();
} else {
  app.on("ready", () => {
    localize().then(async () => {
      createSpalshWindow();
      if (!__prod__) createMainWindow();
      if (__prod__) await autoUpdater.checkForUpdates();
      if (isLinux) {
        createMainWindow();
        skipUpdateCheck(splash);
      }
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
  // skip the update if it takes more than 1 minute
  skipUpdateTimeout = setTimeout(() => {
    skipUpdateCheck(splash);
  }, 60000);
});
autoUpdater.on('download-progress', (progress) => {
  let prog = Math.floor(progress.percent)
  splash.webContents.send('percentage', prog);
  splash.setProgressBar(prog);
  // stop timeout that skips the update
  if (skipUpdateTimeout) {
    clearTimeout(skipUpdateTimeout);
  }
});
autoUpdater.on('update-downloaded', () => {
  splash.webContents.send('relaunch');
  // stop timeout that skips the update
  if (skipUpdateTimeout) {
    clearTimeout(skipUpdateTimeout);
  }
  setTimeout(async () => {
    autoUpdater.quitAndInstall();
  }, 1000);
});
autoUpdater.on('update-not-available', () => {
  createMainWindow();
  splash.webContents.send('launch');
  windowShowInterval = setInterval(() => {
    if (shouldShowWindow) {
      splash.destroy();
      mainWindow.show();
      clearInterval(windowShowInterval);
    }
  }, 500);
});
app.on("window-all-closed", async () => {
  await exitApp();
});
app.on("activate", () => {
  if (mainWindow === null) {
    localize().then(() => {
      createMainWindow();
    })
  }
});

function skipUpdateCheck(splash: BrowserWindow) {
  splash.webContents.send('skipCheck');
  windowShowInterval = setInterval(() => {
    // stop timeout that skips the update
    if (skipUpdateTimeout) {
      clearTimeout(skipUpdateTimeout);
    }
    if (shouldShowWindow) {
      splash.webContents.send('launch');
      clearInterval(windowShowInterval);
      setTimeout(() => {
        splash.destroy();
        mainWindow.show();
      }, 800);
    }
  }, 500);
}

