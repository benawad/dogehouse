import { Presence } from "discord-rpc";
import { ipcMain } from "electron";
import { setPresence } from "./index";
let inRoom = false;
let PREV_PAGE_DATA: {
  page: string;
  opened: boolean;
  modal: boolean;
  data: any;
};
const START_TIME = Date.now();
const ROOM_DATA_UPDATE_FUNC = (event, data) => {
  if (inRoom) {
    let voiceState = "Muted";
    let isMuted = true;
    let isDeafened = false;
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
          isSpeaker = meInRoom.roomPermissions.isSpeaker;
        } else if (data.currentRoom.room.creatorId === data.me.id) {
          isSpeaker = true;
        }
      }
      if (isSpeaker) {
        isMuted = data.muted;
        voiceState = isMuted ? "Muted" : "Unmuted";
      }
      if (data.deafened) {
        isDeafened = data.deafened;
        voiceState = isDeafened ? "Deafened" : voiceState;
      }
      let pdata: Presence = {
        state: isPrivate
          ? "In a private room"
          : `In ${data.currentRoom.room.name}`,
      };
      if (!isPrivate) {
        pdata.details = isSpeaker
          ? `Speaking (${data.currentRoom.users.length} of ထ)`
          : `Listening (${data.currentRoom.users.length} of ထ)`;
        pdata.partyId = data.currentRoom.room.id;
        pdata.startTimestamp = new Date(data.currentRoom.room.inserted_at).getTime();
        pdata.smallImageKey = !isDeafened ? isSpeaker && !isMuted ? "mic_on" : "mic_off" : "speaker_off";
        pdata.smallImageText = isSpeaker ? `Speaker - ${voiceState}` : isDeafened ? `Listener - ${voiceState}` : `Listener`;
        pdata.buttons = [
          {
            label: "Join Room",
            url: `https://dogehouse.tv/room/${data.currentRoom.room.id}`,
          },
        ];
      }
      setPresence(pdata);
    }
  }
};
const ROOM_JOINED_FUNC = (event, newinRoom) => {
  inRoom = newinRoom;
};

const PAGE_UPDATE_FUNC = (
  event,
  pageData: { page: string; opened: boolean; modal: boolean; data: any }
) => {
  if (!inRoom) {
    if (pageData.opened) {
      if (!pageData.modal) PREV_PAGE_DATA = pageData;
      let presence: Presence = {
        partyId: "dogehouse69funnyhaha",
        startTimestamp: START_TIME,
      };
      switch (pageData.page) {
        case "home":
          presence.details = "Browsing Rooms";
          presence.state = `${pageData.data} public rooms`;

          break;
        case "voice-settings":
          presence.details = "User Settings";
          presence.state = "Editing Voice Settings";
          break;
        case "overlay-settings":
          presence.details = "User Settings";
          presence.state = "Editing Overlay Settings";
          break;
        case "sound-effect-settings":
          presence.details = "User Settings";
          presence.state = "Editing Sound Effect Settings";
          break;
        case "profile":
          presence.details = "User Profile";
          presence.state = `Viewing @${pageData.data}`;
          break;
        case "edit-profile":
          presence.details = "User Settings";
          presence.state = "Editing Profile";
          break;
        default:
          presence.details = "Taking DogeHouse to the moon";
          break;
      }
      setPresence(presence);
    } else {
      if (PREV_PAGE_DATA) {
        PAGE_UPDATE_FUNC(event, PREV_PAGE_DATA);
      } else {
        setPresence({ details: "Taking DogeHouse to the moon" });
      }
    }
  }
};

export async function startRPCIPCHandler() {
  ipcMain.on("@rpc/page", PAGE_UPDATE_FUNC);
  ipcMain.on("@room/joined", ROOM_JOINED_FUNC);
  ipcMain.on("@room/data", ROOM_DATA_UPDATE_FUNC);
}

export async function stopRPCIPCHandler() {
  ipcMain.removeListener("@rpc/page", PAGE_UPDATE_FUNC);
  ipcMain.removeListener("@room/joined", ROOM_JOINED_FUNC);
  ipcMain.removeListener("@room/data", ROOM_DATA_UPDATE_FUNC);
}
