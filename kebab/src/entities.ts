import { ConsumerOptions } from "mediasoup-client/lib/types";

export type UUID = string;

export type RoomPeer = {
  peerId: UUID;
  consumerParameters: ConsumerOptions;
};

export type UserPreview = {
  id: UUID;
  displayName: string;
  numFollowers: number;
  avatarUrl: string | null;
};

export type ChatMode = "default" | "disabled" | "follower_only";

export type Room = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  numPeopleInside: number;
  voiceServerId: string;
  creatorId: string;
  peoplePreviewList: Array<UserPreview>;
  autoSpeaker: boolean;
  inserted_at: string;
  chatMode: ChatMode;
  chatThrottle: number;
};

export interface ScheduledRoom {
  roomId: UUID | null;
  description: string;
  scheduledFor: string;
  numAttending: number;
  name: string;
  id: UUID;
  creatorId: UUID;
  creator: User;
}

export type User = {
  youAreFollowing?: boolean;
  username: string;
  online: boolean;
  numFollowing: number;
  numFollowers: number;
  lastOnline: string;
  id: UUID;
  followsYou?: boolean;
  botOwnerId?: string | null;
  displayName: string;
  currentRoomId?: UUID | null;
  currentRoom: Room;
  bio: string | null;
  avatarUrl: string;
  bannerUrl: string | null;
  whisperPrivacySetting: "on" | "off";
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
  bannerUrl: string;
  numFollowing: number;
  numFollowers: number;
  currentRoom?: Room;
  botOwnerId?: string;
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
  iBlockedThem?: boolean;
};

export type RoomUser = {
  roomPermissions?: RoomPermissions | null;
} & UserWithFollowInfo;

export type CurrentRoom = Room & {
  users: RoomUser[];
  muteMap: BooleanMap;
  deafMap: BooleanMap;
  activeSpeakerMap: BooleanMap;
  autoSpeaker: boolean;
};

export type BooleanMap = Record<UUID, boolean>;
