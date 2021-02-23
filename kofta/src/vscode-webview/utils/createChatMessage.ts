import { linkRegex } from "./../constants";
import { BaseUser } from "../types";
// @ts-ignore
import normalizeUrl from "normalize-url";

export const createChatMessage = (message: string, mentions: BaseUser[]) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  message.split(" ").forEach((item) => {
    const isLink = linkRegex.test(item);
    const isMention = mentions.find(
      (m) => item.replace("@", "") === m.username
    );

    if (isLink || isMention) {
      tokens.push({
        t: isLink ? "link" : "mention",
        v: isMention ? item.replace("@", "") : normalizeUrl(item),
      });
    } else {
      const lastToken = tokens[tokens.length - 1];
      if (lastToken && lastToken.t === "text") {
        tokens[tokens.length - 1].v = lastToken.v + " " + item;
      } else {
        tokens.push({
          t: "text",
          v: item,
        });
      }
    }
  });

  return tokens;
};
