import isElectron from "is-electron";
import React, { useState } from "react";
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
import { MacButton } from "../../ui/MacButton";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export function ElectronHeader() {
  return useHostStore.getState().isMac ? <MacHeader /> : <WinHeader />;
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
      <div className="w-full header-drag-region"></div>
      <div className="header-icons flex flex-row-reverse w-auto space-x-2 space-x-reverse">
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
  const [hovering, setHovering] = useState(false);
  return (
    <div className="electron-header z-50">
      <div
        className="header-icons-mac flex flex-row space-x-2 content-center"
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        <MacButton
          icon={hovering ? <MacCloseIcon /> : null}
          size="small"
          color="red"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/quit");
          }}
        />
        <MacButton
          icon={hovering ? <MacMinimizeIcon /> : null}
          size="small"
          color="yellow"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/minimize");
          }}
        />
        <MacButton
          icon={hovering ? <MacMaximizeIcon /> : null}
          size="small"
          color="green"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/maximize");
          }}
        />
      </div>
      <div className="w-full header-drag-region"></div>
    </div>
  );
}
