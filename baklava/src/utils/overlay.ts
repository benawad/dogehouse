import { BrowserWindow } from 'electron';
import { __prod__ } from '../electron';

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

    overLay.loadURL("http://localhost:5000");
    OW.attachTo(overLay, target);
    return overLay;
}
