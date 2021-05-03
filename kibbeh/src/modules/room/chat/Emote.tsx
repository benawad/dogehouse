import React from "react";
import { EmoteKeys, emoteMap } from "./EmoteData";

interface CustomEmojiProps {
  emote: EmoteKeys;
  style?: React.CSSProperties;
  title?: string;
  alt?: string;
  className?: string;
  size?: "small";
}

export const Emote: React.FC<CustomEmojiProps> = ({
  emote,
  size,
  style,
  title = emote,
  alt = `:${emote}:`,
  className,
}) => {
  const src = emoteMap[emote.toLowerCase()];
  let cn = "";
  if (size === "small") {
    cn = `w-3 h-3`;
  }
  return src ? (
    <>
      <img
        style={style}
        className={`inline ${cn} ${className}`}
        alt={alt}
        title={title}
        src={src}
      />{" "}
    </>
  ) : (
    <>{":" + emote + ":"}</>
  );
};
