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
  {
    name: "WAYTOODANK",
    short_names: ["WAYTOODANK"],
    keywords: ["dank", "feelsdankman"],
    imageUrl: "/emotes/waytoodank.gif",
  },
  {
    name: "CryptoBTC",
    short_names: ["CryptoBTC"],
    keywords: ["crypto", "btc", "bitcoin"],
    imageUrl: "/emotes/cryptoBTC.png",
  },
  {
    name: "CryptoETH",
    short_names: ["CryptoETH"],
    keywords: ["crypto", "eth", "ethereum"],
    imageUrl: "/emotes/cryptoETH.png",
  },
  {
    name: "CryptoBNB",
    short_names: ["CryptoBNB"],
    keywords: ["crypto", "bnb", "binance"],
    imageUrl: "/emotes/cryptoBNB.png",
  },
  {
    name: "CryptoLTC",
    short_names: ["CryptoLTC"],
    keywords: ["crypto", "ltc", "litecoin"],
    imageUrl: "/emotes/cryptoLTC.png",
  },
  {
    name: "CryptoBCH",
    short_names: ["CryptoBCH"],
    keywords: ["crypto", "bch", "bitcoin", "bitcoincash"],
    imageUrl: "/emotes/cryptoBCH.png",
  },
  {
    name: "CryptoDOGE",
    short_names: ["CryptoDOGE"],
    keywords: ["crypto", "doge", "dogecoin", "bestcoin"],
    imageUrl: "/emotes/cryptoDOGE.png",
  },
  {
    name: "CryptoSUSHI",
    short_names: ["CryptoSUSHI"],
    keywords: ["crypto", "sushi", "swap", "sushiswap"],
    imageUrl: "/emotes/cryptoSUSHI.png",
  },
  {
    name: "CryptoZEC",
    short_names: ["CryptoZEC"],
    keywords: ["crypto", "zec", "zcash"],
    imageUrl: "/emotes/cryptoZEC.png",
  },
  {
    name: "CryptoETC",
    short_names: ["CryptoETC"],
    keywords: ["crypto", "etc", "ethereum", "ethereumclassic"],
    imageUrl: "/emotes/cryptoETC.png",
  },
  {
    name: "CryptoCAKE",
    short_names: ["CryptoCAKE"],
    keywords: ["crypto", "cake", "swap", "pancakeswap"],
    imageUrl: "/emotes/cryptoCAKE.png",
  },
  {
    name: "CryptoADA",
    short_names: ["CryptoADA"],
    keywords: ["crypto", "ada", "cardano"],
    imageUrl: "/emotes/cryptoADA.png",
  },
  {
    name: "CryptoXRP",
    short_names: ["CryptoXRP"],
    keywords: ["crypto", "xrp", "ripple"],
    imageUrl: "/emotes/cryptoXRP.png",
  },
  {
    name: "CryptoUSDC",
    short_names: ["CryptoUSDC"],
    keywords: ["crypto", "usdc", "usdcoin"],
    imageUrl: "/emotes/cryptoUSDC.png",
  },
  {
    name: "DodgyCoin",
    short_names: ["DodgyCoin"],
    keywords: ["crypto", "doge", "dodgycoin"],
    imageUrl: "/emotes/dodgyCoin.png",
  },
].map((e) => ({ ...e, customCategory: "Custom", text: "", emoticons: [] }));

export const emoteMap: Record<string, string> = {};

export type CustomEmote = EmojiData & {
  customCategory: string;
};

customEmojis.forEach((e) => {
  emoteMap[e.name] = e.imageUrl;
});
