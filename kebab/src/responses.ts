import { Room, RoomUser, ScheduledRoom, User, UUID } from "./entities";

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

export type GetRoomUsersResponse = {
  users: User[];
  roomId: UUID;
  raiseHandMap: Record<string, boolean>;
  muteMap: Record<string, boolean>;
  autoSpeaker: boolean;
  activeSpeakerMap: Record<string, boolean>;
};

export type NewRoomDetailsResponse = {
  roomId: UUID;
  name: string;
  isPrivate: boolean;
  description: string;
};
