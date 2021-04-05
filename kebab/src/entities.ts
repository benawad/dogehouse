import { ConsumerOptions } from "mediasoup-client/lib/types";

export type UUID = string;

export type RoomPeer = {
  peerId: UUID;
  consumerParameters: ConsumerOptions;
};

export type UserPreview = {
  numFollowers: number;
  id: UUID;
  displayName: string;
};

export type Room = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  numPeopleInside: number;
  voiceServerId: string;
  creatorId: string;
  peoplePreviewList: Array<{
    id: string;
    displayName: string;
    numFollowers: number;
  }>;
  inserted_at: string;
};

export interface ScheduledRoom {
  roomId: UUID | null;
  description: string;
  scheduledFor: string;
  numAttending: number;
  name: string;
  id: UUID;
  creatorId: UUID;
}

export type User = {
  youAreFollowing?: boolean;
  username: string;
  roomPermissions?: unknown;
  online: boolean;
  numFollowing: number;
  numFollowers: number;
  lastOnline: string;
  id: UUID;
  followsYou?: boolean;
  displayName: string;
  currentRoomId?: UUID;
  currentRoom: Room;
  bio: string;
  avatarUrl: string;
};

export type MessageToken<T extends string = string, V = unknown> = {
  t: T;
  v: V;
};

export type TextToken = MessageToken<"text", string>;
export type MentionToken = MessageToken<"mention", string>;
export type LinkToken = MessageToken<"link", string>;
export type EmoteToken = MessageToken<"emote", string>;
export type CodeBlockToken = MessageToken<"block", string>;

export type Message = {
  id: UUID;
  userId: UUID;
  avatarUrl: UUID;
  color: string;
  displayName: string;
  tokens: MessageToken[];
  username: string;
  deleted?: boolean;
  deleterId?: UUID;
  sentAt: string;
  isWhisper?: boolean;
};

export type BaseUser = {
  username: string;
  online: boolean;
  lastOnline: string;
  id: string;
  bio: string;
  displayName: string;
  avatarUrl: string;
  numFollowing: number;
  numFollowers: number;
  currentRoom?: Room;
};

export type PaginatedBaseUsers = {
  users: BaseUser[];
  nextCursor: number | null;
};

export type RoomPermissions = {
  askedToSpeak: boolean;
  isSpeaker: boolean;
  isMod: boolean;
};

export type UserWithFollowInfo = BaseUser & {
  followsYou?: boolean;
  youAreFollowing?: boolean;
};

export type RoomUser = {
  roomPermissions?: RoomPermissions | null;
} & UserWithFollowInfo;

export type CurrentRoom = Room & {
  users: RoomUser[];
  muteMap: Record<string, boolean>;
  activeSpeakerMap: Record<string, boolean>;
  autoSpeaker: boolean;
};
