import { Presence } from "discord-rpc";
import {
    ipcMain,
} from "electron";
import { setPresence } from "./index";
let inRoom = false;

const ROOM_DATA_UPDATE_FUNC = (event, data) => {
    if (inRoom) {
        let muted = 'Muted';
        let isMuted = true;
        let isSpeaker = false;
        if (data.currentRoom) {
            // kofta dosent send currentRoom.room
            if (!data.currentRoom.room) {
                data.currentRoom.room = data.currentRoom;
            }
            let isPrivate = data.currentRoom.room.isPrivate;
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
            let pdata: Presence = {
                state: isPrivate ? 'In a private room' : data.currentRoom.room.name,
            }
            if (!isPrivate) {
                pdata.details = isSpeaker ? 'Speaking' : 'Listening'
                pdata.partyId = data.currentRoom.room.id
                pdata.startTimestamp = Date.parse(data.currentRoom.room.inserted_at)
                pdata.smallImageKey = isSpeaker && !isMuted ? 'mic_on' : 'mic_off'
                pdata.smallImageText = isSpeaker ? `Speaker - ${muted}` : `Listener`
                pdata.buttons = [
                    { label: 'Join Room', url: `https://dogehouse.tv/room/${data.currentRoom.room.id}` }
                ]
                pdata.partySize = data.currentRoom.users.length;
                pdata.partyMax = data.currentRoom.users.length;
            }
            setPresence(pdata);
        }
    }
}
const ROOM_JOINED_FUNC = (event, newinRoom) => {
    inRoom = newinRoom
}

const PAGE_UPDATE_FUNC = (event, pageData) => {
    if (!inRoom) {
        switch (pageData.page) {
            case "home":
                setPresence({ details: 'Browsing Rooms', state: `${pageData.data} public rooms` });
                break;
            case "voice-settings":
                setPresence({ details: 'User Settings', state: 'Voice Settings' });
                break;
            case "overlay-settings":
                setPresence({ details: 'User Settings', state: 'Overlay Settings' });
                break;
            case "sound-effect-settings":
                setPresence({ details: 'User Settings', state: 'Sound Effect Settings' });
                break;
            case "profile":
                setPresence({ details: `Viewing ${pageData.data}'s profile` });
                break;
            default:
                setPresence({ details: 'Taking DogeHouse to the moon' });
                break;
        }
    }
}

export async function startRPCIPCHandler() {
    ipcMain.on("@rpc/page", PAGE_UPDATE_FUNC)
    ipcMain.on("@room/joined", ROOM_JOINED_FUNC)
    ipcMain.on("@room/data", ROOM_DATA_UPDATE_FUNC)
}

export async function stopRPCIPCHandler() {
    ipcMain.removeListener("@rpc/page", PAGE_UPDATE_FUNC);
    ipcMain.removeListener("@room/joined", ROOM_JOINED_FUNC);
    ipcMain.removeListener("@room/data", ROOM_DATA_UPDATE_FUNC);
}