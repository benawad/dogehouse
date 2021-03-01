export type Room = {
  id: string;
  name: string;
  isPrivate: boolean;
  numPeopleInside: number;
  creatorId: string;
  peoplePreviewList: Array<{
    id: string;
    displayName: string;
    numFollowers: number;
  }>;
};
export type BaseUser = {
  username: string;
  online: boolean;
  lastOnline: Date;
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

export type WsParam = {
  op: string;
  d: any;
};
