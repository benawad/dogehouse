import React, { ReactElement } from "react";
import Grapheme from "grapheme-splitter";
import { parse } from "twemoji-parser";
import eRegex from "emoji-regex";

interface TwemojiProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  text: string;
  className?: string;
}

const splitter = new Grapheme();

export const Twemoji: React.FC<TwemojiProps> = ({
  text,
  className = "",
  ...props
}) => {
  const regex = eRegex();
  const chars = splitter.splitGraphemes(text);

  const parsedChars = chars.map((e) =>
    regex.test(e) ? (
      <img
        {...props}
        className={`emoji ${className || ""}`}
        src={parse(e)[0].url}
      />
    ) : (
      <>{e}</>
    )
  );
  return <>{parsedChars}</>;
};
