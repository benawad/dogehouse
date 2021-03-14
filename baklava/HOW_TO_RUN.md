# How to run

On the latest additions that allow the use of global keybinds a few things have to be noted: 

- Specify your Nodejs ABI number in `package.json` under `iohook/targets`
   - Run `node -v` and note down your nodejs version
   - Note down the `NODE_MODULE_VERSION` from [here](https://nodejs.org/en/download/releases/) by referring your previouly noted down nodejs version
   - In `package.json` add `node-%NODE_MODULE_VERSION%` to `iohook/targets`

- Specify your electron ABI in `package.json` under `iohook/targets`
   - Run an electron app without importing `iohooks`
   - Open the dev console and type `process.versions.modules`
   - In `package.json` add `electron-%process.versions.modules%` to `iohook/targets`

- Run `npm i iohook`
- Finally run `npm run dev` and you global keybinds *(including PTT)* should start working

> **NOTE:** I have no idea why iohook requires this but it does. And I only found iohook to be a reliable module to detect the `keyup` and `keydown` events *(when app in background)* for use with PTT.