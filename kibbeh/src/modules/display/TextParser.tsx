import React from 'react';
import { linkRegex } from '../../lib/constants';
import emojiRegex from "emoji-regex";
import { ParseTextToTwemoji } from '../../ui/Twemoji';

interface TextParserProps {
  children: string
}

export const TextParser: React.FC<TextParserProps> = ({ children }) => {
  return (<>
    {children.split(/(?=[ ,\n])|(?<=[ ,\n])/g).map((text, i) => {
      if (new RegExp(linkRegex).test(text)) return <a key={i} className={"text-accent text-center hover:underline inline font-bold"} href={text}>{text}</a>;
      if (emojiRegex().test(text)) return <ParseTextToTwemoji key={i} text={text}/>;
      return text;
    })}
  </>
  );
};
