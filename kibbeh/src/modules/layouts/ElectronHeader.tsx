import React from "react";
import { WinMaximizeIcon, WinCloseIcon, WinMinimizeIcon } from "../../icons";
export function ElectronHeader() {
  return (
    <div className="electron-header">
      <div className="header-image-cont">
        <img
          className="header-image"
          src="https://github.com/benawad/dogehouse/raw/staging/kibbeh/public/img/doge.png"
          width="20px"
          height="20px"
        />
      </div>
      <p className="header-title">DogeHouse</p>
      <div className="header-icons">
        <div className="header-icon">
          <WinMinimizeIcon />
        </div>
        <div className="header-icon">
          <WinMaximizeIcon />
        </div>
        <div className="header-icon">
          <WinCloseIcon />
        </div>
      </div>
    </div>
  );
}
