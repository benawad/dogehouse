import React from "react";
import Header from 'next/head';

export interface HeaderControllerProps {
  title?: string,
  embed?: {hexColor?: string, image?: string},
  owner?: string,
  additionalKeywords?: string[],
  description?: string,
}

export const HeaderController: React.FC<HeaderControllerProps> = ({
  title = "",
  description = "Dogehouse is taking voice conversations to the moon 🚀",
  owner,
  additionalKeywords,
  embed
}) => {
  return (
   <Header>
    {title ? <title>{title} | DogeHouse</title> : <title>DogeHouse</title>}
    <meta name="description" content={description}/>
    {owner ? <meta name="author" content={owner}/> : ""}
    <meta name="keywords" content={`DogeHouse, Doge${additionalKeywords?.map(k => `, ${k}`)}`}/>
    <meta name="theme-color" content={embed?.hexColor || "#EFE7DD"}/>
    {embed
    ? <>
        <meta name="og:title" content={description}/>
        <meta name="og:type" content={owner ? "music.radio_station" : "website"}/>
        {owner ? <meta name="music:creator" content={owner}/> : ""}
      </>
    : ""}
  </Header>
  );
};
