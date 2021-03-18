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
  {
		name: "catJAM",
		short_names: ["catJAM"],
		keywords: ["catjam", "vibe"],
		imageUrl: "/emotes/catjam.gif",
	},
	{
		name: "Thonk",
		short_names: ["Thonk"],
		keywords: ["thonk", "think"],
		imageUrl: "/emotes/thonk.png",
	},
	{
		name: "DogeHouse",
		short_names: ["DogeHouse"],
		keywords: ["dogehouse", "doge"],
		imageUrl: "/emotes/dogehouse.png",
	},
	{
		name: "SadHouse",
		short_names: ["SadHouse"],
		keywords: ["dogehouse", "doge", "sadhouse"],
		imageUrl: "/emotes/sadhouse.png",
	},
	{
		name: "CoolHouse",
		short_names: ["CoolHouse"],
		keywords: ["dogehouse", "doge", "coolhouse"],
		imageUrl: "/emotes/coolhouse.png",
	},
	{
		name: "WinkHouse",
		short_names: ["WinkHouse"],
		keywords: ["dogehouse", "doge", "winkhouse"],
		imageUrl: "/emotes/winkhouse.png",
	},
	{
		name: "SupriseHouse",
		short_names: ["SupriseHouse"],
		keywords: ["dogehouse", "doge", "suprisehouse", "shock"],
		imageUrl: "/emotes/suprisehouse.png",
	},
	{
		name: "NeutralHouse",
		short_names: ["NeutralHouse"],
		keywords: ["dogehouse", "doge", "neutralhouse"],
		imageUrl: "/emotes/neutralhouse.png",
	},
].map((e) => ({ ...e, customCategory: "Custom", text: "", emoticons: [] }));

export const emoteMap: Record<string, string> = {};

export type CustomEmote = EmojiData & {
  customCategory: string;
};

customEmojis.forEach((e) => {
  emoteMap[e.name] = e.imageUrl;
});
