import { BrowserWindow } from "electron"

export type bWindowsType = {
    main: BrowserWindow,
    overlay: BrowserWindow | undefined
}
