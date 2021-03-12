import React from "react";
import { BaseOverlay } from "../ui/BaseOverlay";
import { SettingsIcon } from "../ui/SettingsIcon";
import { SmSolidUser, SmSolidSettings, SmSolidDogenitro, SmSolidHelp, SmOutlineGlobe, SmSolidCaretRight, SmSolidBug } from "../icons";

export const SettingsDropdown: React.FC<{}> = () => (
    <div style={{ width: 200 }}>
      <BaseOverlay actionButton={ "Log out" }>
        <div className="flex flex-col">
          <SettingsIcon
            icon={<SmSolidUser className={`text-primary-100`} />}
            label={"Profile"}
          />
          <SettingsIcon
            icon={<SmSolidSettings className={`text-primary-100`} />}
            label={"Settings"}
          />
          <SettingsIcon
            icon={<SmSolidDogenitro className={`text-primary-100`} />}
            label={"Wallet"}
          />
          <SettingsIcon
            icon={<SmOutlineGlobe />}
            label={"Language"}
            trailingIcon={<SmSolidCaretRight />}
          />
          <SettingsIcon
            icon={<SmSolidHelp className={"text-primary-100"}/>}
            label={"Help"}
          />
          <SettingsIcon
            icon={<SmSolidBug />}
            label={"Report a bug"}
          />
        </div>
      </BaseOverlay>
    </div>
);