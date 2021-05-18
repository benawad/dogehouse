import React, { useState } from "react";
import { PageComponent } from "../../types/PageComponent";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { MainLayout } from "../layouts/MainLayout";
import { FloatingRoomInfo } from "../layouts/FloatingRoomInfo";
import { TabletSidebar } from "../layouts/TabletSidebar";
import { DeveloperPanel } from "./DeveloperPanel";
import { Bot } from "./Bot";
import { EditBotAvatarModal } from "./EditBotAvatarModal";
import { BotInfo } from "./BotInfo";
import { ProfileBlockController } from "../dashboard/ProfileBlockController";

const bot: Bot = {
  username: 'crispybot1',
  avatarUrl: 'https://cdn.discordapp.com/avatars/484638053554454531/0c8259da231d71c515735b1a0b745fb6.webp',
  displayName: 'Crispy Bot 1.0',
  apiKey: '',
  bio: '',
  bannerUrl: ''
};

export const BotsEditPage: PageComponent<unknown> = ({}) => {
  const { t } = useTypeSafeTranslation();
  const [editAvatar, setEditAvatar] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const token = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title={"Edit Bot"} />
      <MainLayout
        floatingRoomInfo={<FloatingRoomInfo />}
        tabletSidebar={<TabletSidebar />}
        leftPanel={<DeveloperPanel/>}
        rightPanel={<ProfileBlockController />}
        mobileHeader={undefined}
      >
        <EditBotAvatarModal
        isOpen={editAvatar}
        onRequestClose={() => setEditAvatar(false)}
        bot={bot}
        />
        <div className="flex flex-col text-primary-100" style={{ marginTop: 130, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex flex-row w-full justify-between mb-4">
            <div className="flex inline-block text-2xl font-bold">Bot Information</div>
          </div>
          <div className="flex flex-row w-full justify-between">
            <BotInfo
            bot={bot}
            onClick={() => setEditAvatar(true)}
            />

            <div className="flex flex-col justify-between" style={{ height: 200 }}>
              <div
              className="flex flex-col justify-between bg-primary-800 rounded-lg p-4"
              style={{ width: 390, height: 150 }}
              >
                <div className="flex flex-col">
                  <div className="text-base font-bold">Token</div>
                  <div
                  className={`flex items-center justify-start bg-primary-900 w-full rounded pl-2 ${!showToken ? 'text-accent cursor-pointer' : ''}`}
                  style={{ height: 25 }}
                  onClick={() => setShowToken(true)}
                  >
                    {showToken ? token : 'Click to reveal token'}
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <button
                  className="bg-primary-700 md:hover:bg-primary-600 rounded-lg"
                  style={{ width: 150, height: 40 }}
                  onClick={() => navigator.clipboard?.writeText(token)}
                  >Copy</button>
                  <button
                  className="bg-primary-700 md:hover:bg-primary-600 rounded-lg"
                  style={{ width: 150, height: 40 }}
                  onClick={() => null}
                  >Regenerate</button>
                </div>
              </div>
              <button
                className="bg-accent md:hover:bg-accent-hover rounded-lg"
                style={{ width: 250, height: 40 }}
                onClick={() => null}
                >Delete</button>
            </div>
          </div>
        </div>
      </MainLayout>
    </WaitForWsAndAuth>
  );
};

BotsEditPage.ws = true;
