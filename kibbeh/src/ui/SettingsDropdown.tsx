import { User } from "@dogehouse/kebab";
import React, { ReactNode, useState } from "react";
import { useDebugAudioStore } from "../global-stores/useDebugAudio";
import {
  OutlineGlobe,
  SolidBug,
  SolidCaretRight,
  SolidMicrophone,
  SolidTime,
  SolidUser,
  SolidVolume,
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
  const { debugAudio, setDebugAudio } = useDebugAudioStore();

  return (
    <div
      className="flex whitespace-nowrap overflow-ellipsis"
      style={{ width: 200 }}
    >
      <BaseOverlay
        onActionButtonClicked={onActionButtonClicked}
        actionButton={t("components.settingsDropdown.logOut.button")}
        overlay={currentOverlay}
      >
        <div className="flex flex-col">
          <ApiPreloadLink
            data-testid="profile-link"
            route="profile"
            data={{ username: user.username }}
          >
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
          <SettingsIcon
            label={
              !debugAudio
                ? t("components.settingsDropdown.debugAudio.debugAudio")
                : t("components.settingsDropdown.debugAudio.stopDebugger")
            }
            icon={<SolidVolume />}
            transition
            onClick={() => setDebugAudio(!debugAudio)}
          />
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
