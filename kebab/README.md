# dogehouse-client
Client-side implementation of DogeHouse API.

## Usage
- **In web =>** see `examples/mediasoup-audio/` and `examples/react-chat`
- **In Node =>** see `examples/chat/` and `examples/bot/` (note that you need to have DOM in tsc's libs)

### An example bot
```typescript
require("dotenv").config();

import { raw, wrap, tokensToString, stringToToken } from "@dogehouse/kebab";

const commandRegex = /^\/([^ ]+) ?(.*)$/;
const main = async () => {
  try {
    const wrapper = wrap(await raw.connect(
      process.env.DOGEHOUSE_TOKEN!,
      process.env.DOGEHOUSE_REFRESH_TOKEN!,
      {
        onConnectionTaken: () => {
          console.error("\nAnother client has taken the connection");
          process.exit();
        }
      }
    ));

    const { rooms } = await wrapper.query.getTopPublicRooms();
    const theRoom = rooms[0];

    wrapper.subscribe.newChatMsg(async ({ userId, msg }) => {
      const text = tokensToString(msg.tokens);

      console.log(`${msg.displayName} > ${text}`);
      if(userId === wrapper.connection.user.id) return;

      const [, command, parameters] = commandRegex.exec(text) ?? ["", ""];

      switch(command) {
        case "help":
          await wrapper.mutation.sendRoomChatMsg(stringToToken("Commands: /help, /goto (owner only), /to_base64 <text>, /from_base64 <buffer>"));
          break;
        case "goto":
          if(msg.username !== process.env.OWNER_USERRNAME || parameters.length == 0) break;

          await wrapper.mutation.leaveRoom();
          await wrapper.query.joinRoomAndGetInfo(parameters);

          break;
        case "to_base64":
          if(parameters.length == 0) break;

          await wrapper.mutation.sendRoomChatMsg(stringToToken(Buffer.from(parameters, "utf-8").toString("base64")));

          break;
        case "from_base64":
          if(parameters.length == 0) break;

          await wrapper.mutation.sendRoomChatMsg(stringToToken(Buffer.from(parameters, "base64").toString("utf-8")));

          break;
      }
    });

    console.info(`=> starting in room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    await wrapper.query.joinRoomAndGetInfo(theRoom.id);
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
    console.error(e)
  }
};

main();
```
