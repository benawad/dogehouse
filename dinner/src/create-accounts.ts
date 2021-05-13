import { http, raw, wrap } from "@dogehouse/kebab";
import { Connection } from "@dogehouse/kebab/lib/raw";

const main = async () => {
  const bot = http.wrap(http.create({ baseUrl: "http://localhost:4001" }));
  const tokens: Array<{ accessToken: string; refreshToken: string }> = [];

  for (let i = 0; i < 900; i++) {
    console.log(i);
    tokens.push(await bot.testUser("user" + i));
  }

  const conns: Connection[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const { accessToken, refreshToken } = tokens[i];
    conns.push(
      await raw.connect(accessToken, refreshToken, {
        url: "ws://localhost:4001/socket",
      })
    );
  }

  for (const conn of conns) {
    await wrap(conn).query.joinRoomAndGetInfo("");
  }
};

main();
