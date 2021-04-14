import isElectron from "is-electron";
import React from "react";
import {
  WinMaximizeIcon,
  WinCloseIcon,
  WinMinimizeIcon,
  MacMaximizeIcon,
  MacCloseIcon,
  MacMinimizeIcon,
} from "../../icons";
import { Button } from "../../ui/Button";
import { useHostStore } from "../../global-stores/useHostStore";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export function ElectronHeader() {
  return !useHostStore.getState().isMac ? <MacHeader /> : <WinHeader />;
}

function WinHeader() {
  return (
    <div className="electron-header z-50">
      <div className="header-image-cont">
        <img
          className="header-image"
          src="https://github.com/benawad/dogehouse/raw/staging/kibbeh/public/img/doge.png"
          width="20px"
          height="20px"
        />
      </div>
      <p className="header-title">DogeHouse</p>
      <div className="header-icons flex flex-row-reverse w-full space-x-2 space-x-reverse">
        <Button
          icon={<WinCloseIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline hover:bg-accent-hover"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/quit");
          }}
        />
        <Button
          icon={<WinMaximizeIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/maximize");
          }}
        />
        <Button
          icon={<WinMinimizeIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/minimize");
          }}
        />
      </div>
    </div>
  );
}

function MacHeader() {
  return (
    <div className="electron-header z-50">
      <div className="header-image-cont">
        <img
          className="header-image"
          src="https://github.com/benawad/dogehouse/raw/staging/kibbeh/public/img/doge.png"
          width="20px"
          height="20px"
        />
      </div>
      <p className="header-title">DogeHouse</p>
      <div className="header-icons flex flex-row-reverse w-full space-x-2 space-x-reverse">
        <Button
          icon={<MacCloseIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline hover:bg-accent-hover"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/quit");
          }}
        />
        <Button
          icon={<MacMaximizeIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/maximize");
          }}
        />
        <Button
          icon={<MacMinimizeIcon width={10} height={10} />}
          size="small"
          color="secondary"
          className="remove-outline"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/minimize");
          }}
        />
      </div>
    </div>
  );
}
