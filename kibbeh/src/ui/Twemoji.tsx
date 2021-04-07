import React, { ReactElement } from "react";
import Grapheme from "grapheme-splitter";
import { parse } from "twemoji-parser";

interface TwemojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  text: string;
}

const regex = /\p{Emoji_Presentation}/gu;
const splitter = new Grapheme();

export const Twemoji: React.FC<TwemojiProps> = ({
  text,
  className,
  ...props
}) => {
  const chars = splitter.splitGraphemes(text);

  const parsedChars = chars.map((e) =>
    regex.test(e) ? (
      <img
        {...props}
        className={`emoji inline ${className || ""}`}
        alt={e}
        src={parse(e)[0].url}
      />
    ) : (
      e
    )
  );
  return <>{parsedChars}</>;
};
