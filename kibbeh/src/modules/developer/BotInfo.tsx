import React from "react";
import { Bot } from "./Bot";
import { BotIcon } from "./BotIcon";

interface BotInfoProps {
    bot: Bot
    onClick: () => any;
}

export const BotInfo: React.FC<BotInfoProps> = ({bot, onClick }) => {
    return (
        <div
        className="flex flex-col bg-primary-800 rounded-lg items-center justify-center"
        style={{ width: 190, height: 200 }}
        >
            <BotIcon
            alt={`${bot.username}-s-avatar`}
            src={bot.avatarUrl}
            onClick={onClick}
            />
            <div className="flex inline-block text-base font-medium">{bot.displayName}</div>
            <div className="flex inline-block text-primary-300 text-base font-medium">@{bot.username}</div>
        </div>
    );
};