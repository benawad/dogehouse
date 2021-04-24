import { BrowserWindow } from 'electron';
import * as path from "path";
import { __prod__ } from '../../electron';

export function createOverlay(target: string, OW: any) {
    const overLay = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
        },
        ...OW.WINDOW_OPTS,
    });
    overLay.loadFile(path.join(__dirname, "../../resources/overlay/build/index.html"));
    //overLay.loadURL("http://localhost:5000");
    OW.attachTo(overLay, target);
    return overLay;
}
