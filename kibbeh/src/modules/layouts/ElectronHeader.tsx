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
import { useHostStore } from "../../global-stores/useHostStore";
import { MacButton } from "../../ui/MacButton";
import { WinButton } from "../../ui/WinButton";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

function WinHeader() {
  return (
    <div className="electron-header z-10">
      <div className="header-image-cont">
        <img
          className="header-image"
          src="https://github.com/benawad/dogehouse/raw/staging/kibbeh/public/img/doge.png"
          width="18px"
          height="18px"
          style={{
            minWidth: "18px",
            minHeight: "18px",
          }}
        />
      </div>
      <div className="header-title">DogeHouse</div>
      <div className="w-full header-drag-region"></div>
      <div className="header-icons flex flex-row-reverse w-auto">
        <WinButton
          icon={<WinCloseIcon width={10} height={10} />}
          className="hover:bg-accent-hover"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/quit");
          }}
        />
        <WinButton
          icon={<WinMaximizeIcon width={10} height={10} />}
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/maximize");
          }}
        />
        <WinButton
          icon={<WinMinimizeIcon width={10} height={10} />}
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
        className="header-icons-mac flex flex-row space-x-2 content-center ml-5"
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        <MacButton
          icon={hovering ? <MacCloseIcon /> : null}
          color="red"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/quit");
          }}
        />
        <MacButton
          icon={hovering ? <MacMinimizeIcon /> : null}
          color="yellow"
          onClick={() => {
            if (isElectron()) ipcRenderer.send("@app/minimize");
          }}
        />
        <MacButton
          icon={hovering ? <MacMaximizeIcon /> : null}
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

export function ElectronHeader() {
  if (!isElectron() || useHostStore.getState().isLinux) {
    return null;
  }

  return useHostStore.getState().isMac ? <MacHeader /> : <WinHeader />;
}
