import { Client, Presence } from "discord-rpc";
import logger from "electron-log";
import { startRPCIPCHandler, stopRPCIPCHandler } from "./ipc";
import dotenv from "dotenv";
// @ts-ignore
import { DISCORD_CLIENT_ID } from "../../constants";

dotenv.config();

const clientId = DISCORD_CLIENT_ID || process.env.DISCORD_CLIENT_ID;
let client: Client;

export let RPC_RUNNING = false;
const defaultData: Presence = {
  largeImageKey: "logo",
  largeImageText: "DogeHouse",
  instance: true,
};

export async function startRPC() {
  client = new Client({ transport: "ipc" });
  client.login({ clientId }).catch((e) => {
    logger.error(e);
  });

  client.on("ready", () => {
    RPC_RUNNING = true;
    startRPCIPCHandler();
    setPresence({ details: "Logging In..." });
  });
}

export async function setPresence(data: Presence) {
  if (RPC_RUNNING) {
    client.setActivity(Object.assign(data, defaultData));
  }
}

// added this for when there will be a electron settings page
export async function stopRPC() {
  stopRPCIPCHandler();
  client.destroy();
  RPC_RUNNING = false;
}
