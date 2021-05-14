require("dotenv").config();

import { raw, wrap } from "@dogehouse/kebab";

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

    wrapper.mutation.userCreateBot(process.env.DOGEHOUSE_BOT_NAME!).then(res => {
      console.log(res)
    }).catch(err => {
      console.error(err)
    })
  } catch (e) {
    if (e.code === 4001) console.error("invalid token!");
    console.error(e)
  }
};

main();
