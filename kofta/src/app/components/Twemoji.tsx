import React from "react";

type TwiimojiProps = {
  rawEmoji: string
}

export const Twemoji = ({rawEmoji}: TwiimojiProps) => {
    const img = emojiToTwemoji(rawEmoji);
    return (
        <img
            src={`https://twemoji.maxcdn.com/v/latest/svg/${img}.svg`}
            className="w-8 h-8"
            alt={rawEmoji}
        />
    );
};

/* Emoji parsing code taken from Twimoji, removed offical library due to errors */
const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;

function toCodePoint(unicodeSurrogates: string, sep?: string) {
    let r = []
        , c = 0
        , p = 0
        , i = 0;
    while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);
        if (p) {
            r.push((65536 + (p - 55296 << 10) + (c - 56320)).toString(16));
            p = 0;
        } else if (55296 <= c && c <= 56319) {
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }
    return r.join(sep || "-");
}

function emojiToTwemoji(rawText: string) {
    return toCodePoint(rawText.indexOf(U200D) < 0 ? rawText.replace(UFE0Fg, "") : rawText);
}