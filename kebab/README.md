# Kebab
The official DogeHouse API client.

## Usage
- **In web =>** see `examples/mediasoup-audio/` and `examples/react-chat/`
- **In Node =>** see `examples/chat/` and `examples/bot/` (note that you need to have DOM in tsc's libs)

### A simple bot
```typescript
import { raw, createClient, httpRequest, httpEndpoint, tokensToString, stringToToken } from "@dogehouse/kebab";

const commandRegex = /^\/([^ ]+) ?(.*)$/;
const main = async () => {
  try {
    const credentials = await httpRequest(httpEndpoint.bot.auth, { apiKey: process.env.DOGEHOUSE_API_KEY! });
    const client = createClient(await raw.connect(
      credentials.accessToken,
      credentials.refreshToken,
      {
        onConnectionTaken: () => {
          console.error("\nAnother client has taken the connection");
          process.exit();
        }
      }
    ));

    const sendMessage = (text: string) => client.request(
      "chat:send_msg",
      {
        tokens: stringToToken(text),
        whisperedTo: []
      }
    );

    const { rooms } = await client.request("room:get_top", { cursor: 0, limit: 1 });
    const theRoom = rooms[0];

    client.subscribe("new_chat_msg", async ({ userId, msg }) => {
      const text = tokensToString(msg.tokens);

      console.log(`${msg.displayName} > ${text}`);
      if (userId === client.user.id) return;

      const [, command, parameters] = commandRegex.exec(text) ?? ["", ""];

      switch (command) {
        case "help":
          await sendMessage("Commands: /help, /goto (owner only), /to_base64 <text>, /from_base64 <buffer>");
          break;
        case "goto":
          if (msg.username !== process.env.OWNER_USERRNAME || parameters.length == 0) break;

          await client.request("room:leave", {});
          await client.request("room:join", { roomId: parameters });
          break;
        case "to_base64":
          if (parameters.length == 0) break;

          await sendMessage(Buffer.from(parameters, "utf-8").toString("base64"));

          break;
        case "from_base64":
          if (parameters.length == 0) break;

          await sendMessage(Buffer.from(parameters, "base64").toString("utf-8"));

          break;
      }
    });

    console.info(`=> starting in room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    await client.request("room:join", { roomId: theRoom.id });
  } catch (e) {
    if (e.code === 4001) console.error("invalid token!");
    console.error(e)
  }
};

main();
```
