import React, { useEffect, useState } from "react";
import { BotCard } from "./BotCard";
import { Bot } from "./Bot";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { CreateBotModal } from "./CreateBotModal";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

export const YourBots: React.FC<unknown> = ({}) => {
  const [bots, setBots] = useState<Array<Bot>>([]);
  const [modal, setModal] = useState(false);
  const botsParsed = bots.map((v, i) => (
    <BotCard key={v.displayName + v.avatarUrl + i} bot={v} />
  ));
  const wrapper = useWrappedConn();
  const { t } = useTypeSafeTranslation();
  // wrapper.wrapperection.sendCall('user:create_bot', {username: 'ttttt'}).then(v => console.log(v));
  useEffect(() => {
    wrapper.connection.sendCall("user:get_bots", {}).then((v: any) => {
      setBots(v.bots);
    });
  }, [modal]);
  return (
    <div
      className="flex flex-col text-primary-100 text-2xl font-bold"
      style={{ marginTop: 130, paddingLeft: 20, paddingRight: 20 }}
    >
      <div className="flex flex-row w-full justify-between">
        <div className="flex">
          {t('pages.botEdit.yourBots')} ({bots.length})
        </div>
        {bots.length < 5 ? (
          <button
            className="flex bg-accent md:hover:bg-accent-hover cursor-pointer rounded-lg text-base font-bold content-center justify-center"
            style={{
              width: 120,
              height: 30,
              lineHeight: "30px",
              textAlign: "center",
            }}
            onClick={() => {
              setModal(true);
            }}
          >
            Create bot
          </button>
        ) : (
          <div className="flex text-accent">Max amount of bots reached!</div>
        )}
      </div>
      <div
        className="inline-block w-full bg-primary-300"
        style={{ height: 1, marginTop: '0.75rem', marginBottom: '0.75rem' }}
      ></div>
      <div
        className="flex flex-wrap justify-start"
        style={{ columnGap: "calc(calc(100% - 560px) / 3)", rowGap: "1.5rem" }}
      >
        {botsParsed}
      </div>

      {modal && <CreateBotModal onRequestClose={() => setModal(false)} />}
    </div>
  );
};
