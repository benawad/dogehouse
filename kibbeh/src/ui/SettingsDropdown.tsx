import React from "react";
import { BaseOverlay } from "../ui/BaseOverlay";
import { SettingsIcon } from "../ui/SettingsIcon";
import {
  SmSolidUser,
  SmSolidSettings,
  SmSolidDogenitro,
  SmSolidHelp,
  SmOutlineGlobe,
  SmSolidCaretRight,
  SmSolidBug,
} from "../icons";

export const SettingsDropdown: React.FC = () => (
  <div style={{ width: 200 }}>
    <BaseOverlay actionButton={"Log out"}>
      <div className="flex flex-col">
        <SettingsIcon icon={<SmSolidUser />} label={"Profile"} />
        <SettingsIcon icon={<SmSolidSettings />} label={"Settings"} />
        <SettingsIcon icon={<SmSolidDogenitro />} label={"Wallet"} />
        <SettingsIcon
          icon={<SmOutlineGlobe />}
          label={"Language"}
          trailingIcon={<SmSolidCaretRight />}
        />
        <SettingsIcon icon={<SmSolidHelp />} label={"Help"} />
        <SettingsIcon icon={<SmSolidBug />} label={"Report a bug"} />
      </div>
    </BaseOverlay>
  </div>
);
