import { CurrentRoom, Room } from "../types";

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
