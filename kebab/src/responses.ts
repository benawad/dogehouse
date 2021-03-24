import { Room, RoomUser, ScheduledRoom } from "./entities";

export type GetTopPublicRoomsResponse = {
  rooms: Room[];
  nextCursor: number | null;
};

export type GetScheduledRoomsResponse = {
  nextCursor: number | null;
  scheduledRooms: ScheduledRoom[];
};

export type JoinRoomAndGetInfoResponse = {
  room: Room;
  users: RoomUser[];
  muteMap: Record<string, boolean>;
  roomId: string;
  activeSpeakerMap: Record<string, boolean>;
  autoSpeaker: boolean;
};
