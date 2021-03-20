import React from "react";
import { BaseOverlay } from "../ui/BaseOverlay";
import { SettingsIcon } from "../ui/SettingsIcon";
import {
  SolidUser,
  SolidSettings,
  SolidDogenitro,
  SolidHelp,
  OutlineGlobe,
  SolidCaretRight,
  SolidBug,
} from "../icons";

export const SettingsDropdown: React.FC = () => (
  <div style={{ width: 200 }}>
    <BaseOverlay actionButton={"Log out"}>
      <div className="flex flex-col">
        <SettingsIcon icon={<SolidUser />} label={"Profile"} />
        <SettingsIcon icon={<SolidSettings />} label={"Settings"} />
        <SettingsIcon icon={<SolidDogenitro />} label={"Wallet"} />
        <SettingsIcon
          icon={<OutlineGlobe />}
          label={"Language"}
          trailingIcon={<SolidCaretRight />}
        />
        <SettingsIcon icon={<SolidHelp />} label={"Help"} />
        <SettingsIcon icon={<SolidBug />} label={"Report a bug"} />
      </div>
    </BaseOverlay>
  </div>
);
