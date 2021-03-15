export type UUID = string;

export type UserPreview = {
  numFollowers: number;
  id: UUID;
  displayName: string;
}

export type Room = {
  voiceServerId: number | "";
  peoplePreviewList: UserPreview[];
  numPeopleInside: number;
  name: string;
  isPrivate: boolean;
  id: UUID;
  description: string;
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

export type Message = {
  id: UUID;
  userId: UUID;
  avatarUrl: UUID;
  color: string;
  displayName: string;
  tokens: MessageToken;
  deleted?: boolean;
  deleterId?: UUID;
  sentAt: string;
  isWhisper?: boolean;
}
