import React from "react";
import Header from "next/head";
import { NextPage } from "next";
import { baseUrl } from "../../lib/constants";
export interface HeaderControllerProps {
  title?: string;
  embed?: { hexColor?: string; image?: string };
  owner?: string;
  additionalKeywords?: string[];
  description?: string;
}

export const HeaderController: NextPage<HeaderControllerProps> = ({
  title,
  description = "Dogehouse is taking voice conversations to the moon 🚀",
  owner,
  additionalKeywords = [],
  embed,
}) => {
  return (
    <Header>
      {title ? <title>{title} | DogeHouse</title> : <title>DogeHouse</title>}
      <meta name="description" content={description} />
      {owner ? <meta name="author" content={owner} /> : ""}
      <meta
        name="keywords"
        content={`DogeHouse, Doge${additionalKeywords?.map((k) => `, ${k}`)}`}
      />
      <meta name="theme-color" content={embed?.hexColor || "#EFE7DD"} />
      {embed ? (
        <>
          <meta name="og:title" content={title || "DogeHouse"} />
          <meta
            name="og:type"
            content={owner ? "music.radio_station" : "website"}
          />
          {owner ? <meta name="music:creator" content={owner} /> : ""}
          <meta name="og:description" content={description} />
          <meta name="og:site_name" content="DogeHouse" />
          <meta name="og:image" content={embed.image ? embed.image : `${baseUrl}/img/doge.png`} />
        </>
      ) : (
        ""
      )}
    </Header>
  );
};
