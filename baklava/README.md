# Dogehouse for Desktop (Baklava)

This is the desktop application for Dogehouse.
It uses ElectronJS as a wrapper for [dogehouse.tv](https://dogehouse.tv) and adds other native capabilities.

## Features

- Notifications
- System tray
- Global keybinds
- Splash screen

## How to run

On the latest additions that allow the use of global keybinds a few things have to be noted:

- Specify your Nodejs ABI number in `package.json` under `iohook/targets`
   - Run `node -v` and note down your nodejs version
   - Note down the `NODE_MODULE_VERSION` from [here](https://nodejs.org/en/download/releases/) by referring your previouly noted down nodejs version
   - In `package.json` add `node-%NODE_MODULE_VERSION%` to `iohook/targets`

- Specify your electron ABI in `package.json` under `iohook/targets`
   - Run an electron app using `npm run start` without importing `iohook` *(i.e. remove/comment all imports of `iohook` from `src/electron.ts` and `src/util.ts`)*
   - Open the dev console and type `process.versions.modules`
   - In `package.json` add `electron-%process.versions.modules%` to `iohook/targets`
   - Now uncomment/add the previously removed `iohook` imports

- Run `npm i iohook`
- Run `npm run start` and you global keybinds *(including PTT)* should start working
- *(Optional)* Run `npm run build:%YOUR_PLATFORM_CODE%` and install the app from the build *(located in `/builds`)*

If you encounter any errors while building please mention it in issue [#1002](https://github.com/benawad/dogehouse/issues/1002) or ask for help on the [Discord](https://discord.gg/wCbKBZF9cV0).
If you encounter any other errors make a new issue.

> **NOTE:** I have no idea why iohook requires this but it does. And I only found iohook to be a reliable module to detect the `keyup` and `keydown` events *(when app in background)* for use with PTT.

## Using hot reload

The electron wrapper has the capability for hot reloads during development.
You can run the app in hot reload mode using `npm run dev`.

While in hot reload mode, any time you save changes to a `ts` file, the electron app will recompile and relaunch itself.
To exit hot reload mode, use `Ctrl+C` in the console. This will however, leave the current app window open, so be sure to close that also, as it will no longer have access to hot reload.
