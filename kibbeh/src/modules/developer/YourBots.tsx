import React from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { BotCard } from "./BotCard";
import { Bot } from "./Bot";
import { useWrappedConn } from "../../shared-hooks/useConn";


const bots: Bot[] = [
    {
        username: 'aa',
        avatarUrl: 'https://cdn.discordapp.com/avatars/522503261941661727/ff40436814a3224fdd951578aa9e494b.webp',
        displayName: 'Bot Name',
        apiKey: '',
        bio: '',
        bannerUrl: ''
    },
    {
        username: 'abba',
        avatarUrl: 'https://cdn.discordapp.com/avatars/484638053554454531/0c8259da231d71c515735b1a0b745fb6.webp',
        displayName: 'Bot Name',
        apiKey: '',
        bio: '',
        bannerUrl: ''
    },
    {
        username: 'aa',
        avatarUrl: 'https://cdn.discordapp.com/avatars/522503261941661727/ff40436814a3224fdd951578aa9e494b.webp',
        displayName: 'Bot Name',
        apiKey: '',
        bio: '',
        bannerUrl: ''
    },
    {
        username: 'aa',
        avatarUrl: 'https://cdn.discordapp.com/avatars/522503261941661727/ff40436814a3224fdd951578aa9e494b.webp',
        displayName: 'Bot Name',
        apiKey: '',
        bio: '',
        bannerUrl: ''
    },
    {
        username: 'aa',
        avatarUrl: 'https://cdn.discordapp.com/avatars/484638053554454531/0c8259da231d71c515735b1a0b745fb6.webp',
        displayName: 'Bot Name',
        apiKey: '',
        bio: '',
        bannerUrl: ''
    }
];
const max_bot = 5;

export const YourBots: React.FC<{}> = ({}) => {
    const { t } = useTypeSafeTranslation();
    const botsParsed = bots.map((v, i) => <BotCard key={v.displayName + v.avatarUrl + i} bot={v} />);
  
    const conn = useWrappedConn();

    //conn.connection.sendCall('user:create_bot', {username: 'ttttt'}).then(v => console.log(v));
    conn.connection.sendCall('user:get_bots', {}).then(v => console.log(v));

    return (
        <div className="flex flex-col text-primary-100 text-2xl font-bold" style={{ marginTop: 130, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex flex-row w-full justify-between" >
            <div className="flex inline-block">Your bots ({bots.length})</div>
            {
              bots.length < max_bot ? (
                <button 
                className="flex inline-block bg-accent md:hover:bg-accent-hover cursor-pointer rounded-lg text-base font-bold content-center justify-center"
                style={{ width: 120, height: 30, lineHeight: '30px', textAlign: 'center' }}
                >
                  Create bot
                </button>
              ) : (
                <div className="flex inline-block text-accent">Max amount of bots reached!</div>
              )
            }
          </div>
          <div className="inline-block w-full bg-primary-300  my-3" style={{ height: 1 }}></div>
          <div className="flex flex-wrap justify-start" style={{ columnGap: 'calc(calc(100% - 560px) / 3)', rowGap: '1.5rem' }}>{botsParsed}</div>
        </div>
    );
};