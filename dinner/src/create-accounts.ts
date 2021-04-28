import { http, raw, wrap } from "@dogehouse/kebab";

const main = async () => {
  const bot = http.wrap(http.create({ baseUrl: "http://localhost:4001" }));
  const tokens: Array<{ accessToken: string; refreshToken: string }> = [];

  for (let i = 0; i < 100; i++) {
    console.log(i);
    tokens.push(await bot.testUser("user" + i));
  }

  const [{ accessToken, refreshToken }] = tokens;
  const conn = await raw.connect(accessToken, refreshToken, {
    url: "ws://localhost:4001/socket",
  });
  const api = wrap(conn);

  const newLocal = 5 < 1;

  if (newLocal) {
    api.mutation.userCreateBot("s");
  }
};

main();
