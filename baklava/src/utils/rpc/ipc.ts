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
                    setPresence({ details: 'Browsing Rooms' });
                    break;
                case "voice-settings":
                    setPresence({ details: 'Customising voice settings' });
                    break;
                case "overlay-settings":
                    setPresence({ details: 'Customising overlay settings' });
                    break;
                case "sound-effect-settings":
                    setPresence({ details: 'Customising sound effect settings' });
                    break;
                case "profile":
                    setPresence({ details: `Viewing ${pageData.data}'s profile` });
                    break;
                default:
                    setPresence({ details: 'Taking DogeHouse to the moon' });
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
            if (isSpeaker) {
                if (data.currentRoom.muteMap[data.me.id]) {
                    isMuted = data.currentRoom.muteMap[data.me.id];
                } else {
                    isMuted = false;
                }
                muted = isMuted ? 'Muted' : 'Unmuted';
            }
            let pdata = {
                details: `In ${data.currentRoom.room.name}`,
                state: isSpeaker ? 'Speaker' : 'Listener',
                partyId: data.currentRoom.room.id,
                partySize: data.currentRoom.users.length,
                partyMax: data.currentRoom.users.length,
                startTimestamp: Date.parse(data.currentRoom.room.inserted_at),
                smallImageKey: isSpeaker && !isMuted ? 'mic_on' : 'mic_off',
                smallImageText: isSpeaker ? `Speaker - ${muted}` : `Listener`,
                buttons: [
                    { label: 'Join Room', url: `https://dogehouse.tv/room/${data.currentRoom.room.id}` }
                ]
            }
            setPresence(pdata);
        }
    })
}