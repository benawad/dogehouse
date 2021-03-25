require("dotenv").config();

import readline from "readline";
import { raw, wrap, tokensToString, stringToToken } from "@dogehouse/kebab";

const logger: raw.Logger = (direction, opcode, data, fetchId, raw) => {
  const directionPadded = direction.toUpperCase().padEnd(3, " ");
  const fetchIdInfo = fetchId ? ` (fetch id ${fetchId})` : "";
  console.info(`${directionPadded} "${opcode}"${fetchIdInfo}: ${raw}`);
};

const main = async () => {
  try {
    const connection = await raw.connect(
      process.env.DOGEHOUSE_TOKEN!,
      process.env.DOGEHOUSE_REFRESH_TOKEN!,
      {
        onConnectionTaken: () => {
          console.error("\nAnother client has taken the connection");
          process.exit();
        }
      }
    );

    const wrapper = wrap(connection);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${connection.user.displayName} > `
    })

    const { rooms } = await wrapper.query.getTopPublicRooms();
    const theRoom = rooms[0];

    console.log(`=> joining room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    const extraInfo = await wrapper.query.joinRoomAndGetInfo(theRoom.id);

    const unsubscribe = wrapper.subscribe.newChatMsg(async ({ userId, msg }) => {
      const text = tokensToString(msg.tokens);
      if(userId !== connection.user.id) {
        process.stdout.cursorTo(0);
        console.log(`${msg.displayName} > ${text}`);
      }

      rl.prompt();
    });

    rl.prompt();
    rl.on("line", async input => {
      if(input === "/leave") {
        unsubscribe();
        await wrapper.mutation.leaveRoom();
        console.log("=> left the room");
      } else {
        await wrapper.mutation.sendRoomChatMsg(stringToToken(input));
      }
    })
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
    console.error(e)
  }
};

main();
