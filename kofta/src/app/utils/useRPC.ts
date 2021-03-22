import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export const useRPC = () => {
    let appName
    ipcRenderer.on('@rpc/appName', (event, message) => {
        appName = message
    })
    return appName
}