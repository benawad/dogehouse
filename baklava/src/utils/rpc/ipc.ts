import {
    ipcMain,
} from "electron";
import { setPresence } from "./index";
let inRoom = false;
export async function startRPCIPCHandler() {
    ipcMain.on("@rpc/page", (event, pageData) => {
        if (!inRoom) {
            switch (pageData.page) {
                case "home":
                    setPresence({ state: 'Taking DogeHouse to the moon' });
                    break;
                case "voice-settings":
                    setPresence({ state: 'Customising voice settings' });
                    break;
                case "overlay-settings":
                    setPresence({ state: 'Customising overlay settings' });
                    break;
                case "sound-effect-settings":
                    setPresence({ state: 'Customising sound effect settings' });
                    break;
                case "profile":
                    setPresence({ state: `Viewing ${pageData.data}'s profile` });
                    break;
                default:
                    setPresence({ state: 'Exploring the home page' });
                    break;
            }
        }
    })
    ipcMain.on("@room/joined", (event, newinRoom) => {
        inRoom = newinRoom
    })
    ipcMain.on("@room/data", (event, data) => {
        if (inRoom) {
            let muted = 'Muted';
            let isMuted = true;
            let isSpeaker = false;
            let meInRoom = data.currentRoom.users.find((u) => u.id == data.me.id);
            if (meInRoom) {
                if (meInRoom.roomPermissions) {
                    isSpeaker = meInRoom.roomPermissions.isSpeaker
                } else if (data.currentRoom.room.creatorId === data.me.id) {
                    isSpeaker = true;
                }
            }
            let pdata = {
                state: `In ${data.currentRoom.room.name}`,
                partyId: data.currentRoom.room.id,
                partySize: data.currentRoom.users.length,
                partyMax: data.currentRoom.users.length,
                startTimestamp: Date.parse(data.currentRoom.room.inserted_at),
                smallImageKey: isSpeaker && !isMuted ? 'mic_on' : 'mic_off',
                smallImageText: isSpeaker ? `Speaker - ${muted}` : `Listener - ${muted}`,
            }
            setPresence(pdata);
        }
    })
}