
import { Client, Presence } from 'discord-rpc';
import logger from 'electron-log';
import { startRPCIPCHandler, stopRPCIPCHandler } from './ipc';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.DISCORD_CLIENT_ID || '';
let client: Client;

export let RPC_RUNNING = false;

const defaultData: Presence = {
    largeImageKey: 'logo',
    largeImageText: 'DogeHouse',
    instance: true
}

export async function startRPC() {
    client = new Client({ transport: 'ipc' });
    client.login({ clientId }).catch((e) => {
        logger.error(e)
    });

    client.on('ready', () => {
        RPC_RUNNING = true;
        startRPCIPCHandler();
        setPresence({ details: 'Exploring the home page' });
    })
}

export async function setPresence(data: Presence) {
    client.setActivity(Object.assign(data, defaultData));
}

// added this for when there will be a electron settings page
export async function stopRPC() {
    stopRPCIPCHandler();
    client.destroy();
    RPC_RUNNING = false;
}