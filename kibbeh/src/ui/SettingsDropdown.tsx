import { User } from "@dogehouse/kebab";
import React, { ReactNode, useState } from "react";
import {
  OutlineGlobe,
  SolidBug,
  SolidCaretRight,
  SolidTime,
  SolidUser,
} from "../icons";
import SvgSolidDiscord from "../icons/SolidDiscord";
import { ApiPreloadLink } from "../shared-components/ApiPreloadLink";
import { useTypeSafeTranslation } from "../shared-hooks/useTypeSafeTranslation";
import { BaseOverlay } from "../ui/BaseOverlay";
import { SettingsIcon } from "../ui/SettingsIcon";
import { LanguageSelector } from "./LanguageSelector";

export const SettingsDropdown: React.FC<{
  user: User;
  onCloseDropdown: () => void;
  onActionButtonClicked: () => void;
}> = ({ user, onCloseDropdown, onActionButtonClicked }) => {
  const [currentOverlay, setCurrentOverlay] = useState<ReactNode>(null);
  const { t } = useTypeSafeTranslation();

  return (
    <div className="flex" style={{ width: 200 }}>
      <BaseOverlay
        onActionButtonClicked={onActionButtonClicked}
        actionButton={t("components.settingsDropdown.logOut.button")}
        overlay={currentOverlay}
      >
        <div className="flex flex-col">
          <ApiPreloadLink route="profile" data={{ username: user.username }}>
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SolidUser />}
              label={t("components.settingsDropdown.profile")}
              transition
            />
          </ApiPreloadLink>
          {/* <SettingsIcon icon={<SolidSettings />} label={"Settings"} />
        <SettingsIcon icon={<SolidDogenitro />} label={"Wallet"} /> */}
          <SettingsIcon
            icon={<OutlineGlobe />}
            label={t("components.settingsDropdown.language")}
            trailingIcon={<SolidCaretRight />}
            transition
            onClick={() =>
              setCurrentOverlay(
                <LanguageSelector onClose={() => setCurrentOverlay(null)} />
              )
            }
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
              label={t("components.settingsDropdown.reportABug")}
              transition
            />
          </a>
          <a href="https://dogehouse.tv" rel="noreferrer">
            <SettingsIcon
              onClick={onCloseDropdown}
              icon={<SolidTime />}
              label={t("components.settingsDropdown.useOldVersion")}
              transition
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
              transition
            />
          </a>
        </div>
      </BaseOverlay>
    </div>
  );
};
