import { linkRegex } from "./../constants";
import { BaseUser } from "../types";

// @ts-ignore
import normalizeUrl from "normalize-url";

export const createChatMessage = (
  message: string,
  mentions: BaseUser[],
  roomUsers: BaseUser[] = []
) => {
  const tokens = ([] as unknown) as [
    {
      t: string;
      v: string;
    }
  ];

  const whisperedToUsernames: string[] = [];

  message.split(" ").forEach((item) => {
    const isLink = linkRegex.test(item);
    const withoutAt = item.replace(/@|#/g, "");
    const isMention = mentions.find((m) => withoutAt === m.username);

    // whisperedTo users list
    !isMention ||
      item.indexOf("#@") !== 0 ||
      whisperedToUsernames.push(withoutAt);

    if (isLink || isMention) {
      tokens.push({
        t: isLink ? "link" : "mention",
        v: isMention ? withoutAt : normalizeUrl(item),
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

  return {
    tokens,
    whisperedTo: roomUsers
      .filter((u) =>
        whisperedToUsernames
          .map((u) => u?.toLowerCase())
          .includes(u.username?.toLowerCase())
      )
      .map((u) => u.id),
  };
};
