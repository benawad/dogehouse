
import { Client, Presence } from 'discord-rpc';
import logger from 'electron-log';
import { startRPCIPCHandler } from './ipc';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ transport: 'ipc' });
const clientId = process.env.DISCORD_CLIENT_ID || '';

export const defaultData: Presence = {
    largeImageKey: 'logo',
    largeImageText: 'DogeHouse',
    instance: true
}

export async function startRPC() {
    client.login({ clientId }).catch((e) => {
        logger.error(e)
    });

    client.on('ready', () => {
        startRPCIPCHandler();
        setPresence({ details: 'Exploring the home page' });
    })
}

export async function setPresence(data: Presence) {
    client.setActivity(Object.assign(data, defaultData));
}