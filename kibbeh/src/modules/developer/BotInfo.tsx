import React from "react";
import { Bot } from "./Bot";
import { BotIcon } from "./BotIcon";

interface BotInfoProps {
  bot: Bot;
  onClick: () => any;
}

export const BotInfo: React.FC<BotInfoProps> = ({ bot, onClick }) => {
  return (
    <div
      className="flex flex-col bg-primary-800 rounded-lg items-center justify-center"
      style={{ width: 190, height: 200 }}
    >
      <BotIcon
        username={bot.username}
        src={bot.avatarUrl}
        onClick={onClick}
      />
      <div className="flex text-base font-medium">{bot.displayName}</div>
      <div className="flex text-primary-300 text-base font-medium">
        @{bot.username}
      </div>
    </div>
  );
};
