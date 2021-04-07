import React, { ReactElement } from "react";
import Grapheme from 'grapheme-splitter';
import { parse } from 'twemoji-parser';
import eRegex from 'emoji-regex';

interface TwemojiProps {
  text: string;
}

const regex = eRegex();
const splitter = new Grapheme();

export const Twemoji: React.FC<TwemojiProps> = ({ text }) => {
  const chars = splitter.splitGraphemes(text);

  const parsedChars = chars.map((e) => (
    regex.test(e)
      ? <><img className="emoji" src={parse(e)[0].url} />&nbsp;</>
        : <>{e}</>
        ));
        return (
        <>
          {parsedChars}
        </>
        );
};
