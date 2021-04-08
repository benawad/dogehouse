import DiscordRPC from 'discord-rpc';

/* Discord Client Id in developer portal */
const clientId = '829642922726129694'; /* To be changed to official DogeHouse discord application for discord login */

/* Image key that is added to the developer portal */
const assetId = 'icon';

/* Discord Presence Message for in menus and inside a room */
const defaultMessage: DiscordRPC.Presence = { largeImageKey: assetId, details: 'In Menu' };
const inRoomMessage: DiscordRPC.Presence = { largeImageKey: assetId, details: 'In Room' };

export default class DiscordPresence {
    client: DiscordRPC.Client
    constructor() {
        /* Define the RPC Client */
        this.client = new DiscordRPC.Client({ transport: 'ipc' });
        this.client.on('ready', () => {
            /* Set default message */
            this.client.setActivity(defaultMessage);
        })
    }

    check(url: string) {
        if (!this.client) return;
        if (url.match(/\/room\//)) { /* If in room */
            this.client.setActivity(inRoomMessage);
        } else {
            this.client.setActivity(defaultMessage);
        }
    }

    shutDown() {
        this.client.destroy();
    }

    login() {
        this.client.login({ clientId: clientId });
    }
}