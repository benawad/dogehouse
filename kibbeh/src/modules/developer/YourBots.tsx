import React, { useEffect, useState } from "react";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { BotCard } from "./BotCard";
import { Bot } from "./Bot";
import { useConn, useWrappedConn } from "../../shared-hooks/useConn";
import { wrap } from "@dogehouse/kebab";

const max_bot = 5;

export const YourBots: React.FC<unknown> = ({}) => {
  const [bots, setBots] = useState<Array<Bot>>([]);

  const { t } = useTypeSafeTranslation();
  const botsParsed = bots.map((v, i) => (
    <BotCard key={v.displayName + v.avatarUrl + i} bot={v} />
  ));
  const wrapper = useWrappedConn();
  // wrapper.wrapperection.sendCall('user:create_bot', {username: 'ttttt'}).then(v => console.log(v));
  useEffect(() => {
    wrapper.connection.sendCall("user:get_bots", {}).then((v: any) => {
      setBots(v.bots);
    });
  }, []);
  return (
    <div
      className="flex flex-col text-primary-100 text-2xl font-bold"
      style={{ marginTop: 130, paddingLeft: 20, paddingRight: 20 }}
    >
      <div className="flex flex-row w-full justify-between">
        <div className="flex inline-block">Your bots ({bots.length})</div>
        {bots.length < max_bot ? (
          <button
            className="flex inline-block bg-accent md:hover:bg-accent-hover cursor-pointer rounded-lg text-base font-bold content-center justify-center"
            style={{
              width: 120,
              height: 30,
              lineHeight: "30px",
              textAlign: "center",
            }}
          >
            Create bot
          </button>
        ) : (
          <div className="flex inline-block text-accent">
            Max amount of bots reached!
          </div>
        )}
      </div>
      <div
        className="inline-block w-full bg-primary-300  my-3"
        style={{ height: 1 }}
      ></div>
      <div
        className="flex flex-wrap justify-start"
        style={{ columnGap: "calc(calc(100% - 560px) / 3)", rowGap: "1.5rem" }}
      >
        {botsParsed}
      </div>
    </div>
  );
};
