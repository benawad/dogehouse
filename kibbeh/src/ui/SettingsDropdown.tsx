import React, { ReactNode, useState } from "react";
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
  SolidTime,
} from "../icons";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
import { User } from "@dogehouse/kebab";
import SvgSolidDiscord from "../icons/SolidDiscord";
import { NativeSelect } from "./NativeSelect";
import { LanguageSelector } from "./LanguageSelector";

export const SettingsDropdown: React.FC<{
  user: User;
  onCloseDropdown: () => void;
  onActionButtonClicked: () => void;
}> = ({ user, onCloseDropdown, onActionButtonClicked }) => {
  const [currentOverlay, setCurrentOverlay] = useState<ReactNode>(null);

  return (
    <div style={{ width: 200 }}>
      <BaseOverlay
        onActionButtonClicked={onActionButtonClicked}
        actionButton={"Log out"}
        overlay={currentOverlay}
      >
        <div className="flex flex-col">
          <ApiPreloadLink route="profile" data={{ username: user.username }}>
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SolidUser />}
              label={"Profile"}
            />
          </ApiPreloadLink>
          {/* <SettingsIcon icon={<SolidSettings />} label={"Settings"} />
        <SettingsIcon icon={<SolidDogenitro />} label={"Wallet"} /> */}
          <SettingsIcon
            icon={<OutlineGlobe />}
            label={"Language"}
            trailingIcon={<SolidCaretRight />}
            onClick={() => setCurrentOverlay(<LanguageSelector onClose={() => setCurrentOverlay(null)}/>)}
          />
          {/* <SettingsIcon icon={<SolidHelp />} label={"Help"} /> */}
          <a
            href="https://github.com/benawad/dogehouse/issues"
            target="_blank"
            rel="noreferrer"
          >
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SolidBug />}
              label={"Report a bug"}
            />
          </a>
          <a href="https://dogehouse.tv" rel="noreferrer">
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SolidTime />}
              label={"Use old version"}
            />
          </a>
          <a
            href="https://discord.gg/wCbKBZF9cV"
            target="_blank"
            rel="noreferrer"
          >
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SvgSolidDiscord />}
              label={"Discord"}
            />
          </a>
        </div>
      </BaseOverlay>
    </div>
  );
};
