import { User } from "../types";
import normalizeUrl from "normalize-url";

export const createChatMessage = (message: string, mentions: User[]) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  message.split(" ").forEach((item) => {
    const isLink = /(https?:\/\/|)[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(
      item
    );
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
