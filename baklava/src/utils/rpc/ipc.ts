import {
    ipcMain,
} from "electron";
import { setPresence } from "./index";
let inRoom = false;
export async function startRPCIPCHandler() {
    ipcMain.on("@rpc/page", (event, page) => {
        if (!inRoom) {
            switch (page) {
                case "home":
                    setPresence({ state: 'Exploring the home page' });
                    break;
                case "voice-settings":
                    setPresence({ state: 'Customising voice settings' });
                case "overlay-settings":
                    setPresence({ state: 'Customising overlay settings' });
                case "sound-effect-settings":
                    setPresence({ state: 'Customising sound effect settings' });
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
            let isSpeaker = false;
            console.log(data.currentRoom.users)
            let meInRoom = data.currentRoom.users.find((u) => u.id == data.me.id);
            if (meInRoom) {
                console.log(meInRoom);
                console.log(`myid: ${data.me.id}`)
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
                smallImageKey: isSpeaker ? 'mic_on' : 'mic_off',
                smallImageText: isSpeaker ? 'Speaker' : 'Listener',
            }
            setPresence(pdata);
        }
    })
}