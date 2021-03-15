require("dotenv").config();

const readline = require("readline");
const { raw: { connect } } = require("@dogehouse/client");

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
      {}
    );

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${connection.user.displayName} > `
    })

    const { rooms } = await connection.fetch("get_top_public_rooms", { cursor: 0 });
    const theRoom = rooms[0];

    console.log(`=> joining room "${theRoom.name}" (${theRoom.numPeopleInside} people)`);
    await connection.fetch("join_room", { roomId: theRoom.id }, "join_room_done");

    rl.prompt();
    rl.on("line", async input => {
      const message = { tokens: [{ t: "text", v: input }], whisperTo: [] };
      await connection.send("send_room_chat_msg", message);
    })

    connection.addListener("new_chat_msg", async ({ userId, msg }) => {
      const text = msg.tokens.map(it => it.v).reduce((a, b) => a + b);
      if(userId !== connection.user.id) {
        process.stdout.cursorTo(0);
        console.log(`${msg.displayName} > ${text}`);
      }

      rl.prompt();
    });
  } catch(e) {
    if(e.code === 4001) console.error("invalid token!");
  }
};

main();
