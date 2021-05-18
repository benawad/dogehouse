import React from "react";
import { Bot } from "./Bot";

interface BotIconProps {
    alt?: string;
    src: string;
    onClick: () => any;
}

export const BotIcon: React.FC<BotIconProps> = ({ alt, src, onClick }) => {
    return (
        <div
        className="inline-block mb-2 grid"
        style={{ width: 120, height: 120 }}
        data-testid="single-user-avatar"
        >
            <img
            alt={alt}
            className={'rounded-full w-full h-full object-cover relative'}
            style={{ gridColumn: 1, gridRow: 1 }}
            src={src}
            />
            <button
            className="flex justify-center items-center bg-primary-900 hover:opacity-40 transition duration-200 opacity-0 w-full h-full rounded-full"
            style={{ gridColumn: 1, gridRow: 1 }}
            onClick={onClick}
            >
            <div className="pointer-events-none">Edit Avatar</div>
            </button>
        </div>
    );
};