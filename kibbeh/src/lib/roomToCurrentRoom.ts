import { Room, CurrentRoom } from "@dogehouse/client";

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
