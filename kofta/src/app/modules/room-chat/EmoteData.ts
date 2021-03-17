import { EmojiData } from "emoji-mart";

export const customEmojis = [
  {
    name: "monkaS",
    short_names: ["monkaS"],
    keywords: ["monkas", "pepe"],
    imageUrl: "/emotes/monkas.png",
  },
  {
    name: "HYPERS",
    short_names: ["HYPERS"],
    keywords: ["hypers", "pepe"],
    imageUrl: "/emotes/hypers.png",
  },
  {
    name: "pepeD",
    short_names: ["pepeD"],
    keywords: ["peped", "pepe"],
    imageUrl: "/emotes/peped.gif",
  },
	{
    name: "Pepega",
    short_names: ["Pepega"],
    keywords: ["pepega", "pepe"],
    imageUrl: "/emotes/pepega.png",
  },
	{
    name: "Sadge",
    short_names: ["Sadge"],
    keywords: ["sadge", "pepe"],
    imageUrl: "/emotes/sadge.png",
  },
].map((e) => ({ ...e, customCategory: "BetterTTV", text: "", emoticons: [] }));

export const emoteMap: Record<string, string> = {};

export type CustomEmote = EmojiData & {
  customCategory: string;
};

customEmojis.forEach((e) => {
  emoteMap[e.name] = e.imageUrl;
});
