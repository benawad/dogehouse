import { Room, RoomUser, ScheduledRoom, User, UUID } from "../entities";

export type GetTopPublicRoomsResponse = {
  rooms: Room[];
  nextCursor: number | null;
};

export type GetScheduledRoomsResponse = {
  nextCursor: string | null;
  rooms: ScheduledRoom[];
};

export type JoinRoomAndGetInfoResponse = {
  room: Room;
  users: RoomUser[];
  muteMap: Record<string, boolean>;
  deafMap: Record<string, boolean>;
  roomId: string;
  activeSpeakerMap: Record<string, boolean>;
};

export type GetRoomUsersResponse = {
  users: User[];
  roomId: UUID;
  raiseHandMap: Record<string, boolean>;
  muteMap: Record<string, boolean>;
  deafMap: Record<string, boolean>;
  autoSpeaker: boolean;
  activeSpeakerMap: Record<string, boolean>;
};

export type NewRoomDetailsResponse = {
  roomId: UUID;
  name: string;
  chatThrottle: number;
  isPrivate: boolean;
  description: string;
};

export type InvitationToRoomResponse = {
  type: "invite";
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  roomName: string;
  roomId: UUID;
};

export type CreateBotResponse = {
  apiKey: string | null;
  isUsernameTaken: boolean | null;
  error: string | null;
};
