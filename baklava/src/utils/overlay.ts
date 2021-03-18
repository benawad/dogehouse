import { BrowserWindow } from 'electron';

export function createOverlay(target: string, OW: any) {
    const overLay = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
        
        ...OW.WINDOW_OPTS,
    });

    overLay.loadURL("https://google.com/");
    OW.attachTo(overLay, target);
    return overLay;
}
