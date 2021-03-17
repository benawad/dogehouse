require("dotenv").config();

const readline = require("readline");
const { raw: { connect }, wrap } = require("@dogehouse/client");

const logger = (direction, opcode, data, fetchId, raw) => {
  const directionPadded = direction.toUpperCase().padEnd(3, " ");
  const fetchIdInfo = fetchId ? ` (fetch id ${fetchId})` : "";
  console.info(`${directionPadded} "${opcode}"${fetchIdInfo}: ${raw}`);
};

const main = async () => {
  try {
    const connection = await connect(
      process.env.DOGEHOUSE_TOKEN,
      process.env.DOGEHOUSE_REFRESH_TOKEN,
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

    const rooms = await wrapper.getTopPublicRooms();
    const theRoom = rooms[0];

    console.log(`=> joining room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    await wrapper.joinRoom(theRoom.id);

    const unsubscribe = wrapper.subscribe.newChatMsg(async ({ userId, msg }) => {
      const text = msg.tokens.map(it => it.v).reduce((a, b) => a + b);
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
        await wrapper.leaveRoom();
        console.log("=> left the room");
      } else {
        await wrapper.sendRoomChatMsg([{t: "text", v: input}]);
      }
    })
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
    console.error(e)
  }
};

main();
