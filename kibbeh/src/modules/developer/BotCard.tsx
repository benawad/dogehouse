import React from "react";
import { useRouter } from "next/router";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { SingleUser } from "../../ui/UserAvatar";
import { Bot } from "./Bot";

interface BotCardProps {
  bot: Bot
}

export const BotCard: React.FC<BotCardProps> = ({ bot }) => {
  const { t } = useTypeSafeTranslation();
  const { push } = useRouter();

  return (
    <button
    className="flex flex-col bg-primary-800 cursor-pointer rounded-lg items-center justify-center"
    style={{ width: 140, height: 140 }}
    onClick={() => push(`/developer/bots/edit/[username]`, `/developer/bots/edit/${bot.username}`)}
    >
        <div>
            <SingleUser isOnline={true} src={bot.avatarUrl} username={bot.username}></SingleUser>
        </div>
        <div className="font-bold text-base">
            {bot.displayName}
        </div>
    </button>
  );
};
