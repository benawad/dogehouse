import { Room, CurrentRoom } from "@dogehouse/kebab";

export const roomToCurrentRoom = (r: Room): CurrentRoom =>
  r
    ? {
        ...r,
        muteMap: {},
        users: [],
        activeSpeakerMap: {},
        autoSpeaker: false,
      }
    : r;
