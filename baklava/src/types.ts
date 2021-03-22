import { BrowserWindow } from "electron"

export type bWindowsType = {
    main: BrowserWindow,
    overlay: BrowserWindow | undefined
}

export type IOHookEvent = {
    shiftKey: boolean,
    altKey: boolean,
    ctrlKey: boolean,
    metaKey: boolean,
    keycode: number,
    rawcode: number,
    type: 'keyup' | 'keydown'
}