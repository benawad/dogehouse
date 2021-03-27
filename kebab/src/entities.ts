import { ConsumerOptions } from "mediasoup-client/lib/types";
import {
  GetScheduledRoomsResponse,
  GetTopPublicRoomsResponse,
  JoinRoomAndGetInfoResponse,
} from "./responses";

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

// wrote this a long time ago, don't know if it's accurate
export type UserList = {
  users: {
    youAreFollowing: null | true;
    username: string;
    roomPermissions: { [key: string]: RoomPermissions };
    online: true;
    numFollowing: number;
    numFollowers: number;
    lastOnline: string;
    id: string;
    followsYou: null | true;
    displayName: string;
    currentRoomId: string;
    currentRoom: Room;
    bio: string;
    avatarUrl: string;
  }[];
  roomId: string;
  raiseHandMap: { [key: string]: boolean };
  muteMap: { [key: string]: boolean };
  autoSpeaker: false;
  activeSpeakerMap: { [key: string]: boolean };
};

export type Wrapper = {
  subscribe: {
    newChatMsg: (
      handler: ({ userId, msg }: { userId: UUID; msg: Message }) => void
    ) => void;
  };
  query: {
    getTopPublicRooms: (cursor?: number) => Promise<GetTopPublicRoomsResponse>;
    getUserProfile: (
      idOrUsername: string
    ) => Promise<UserWithFollowInfo | null>;
    getScheduledRooms: (
      cursor?: "" | number,
      getOnlyMyScheduledRooms?: boolean
    ) => Promise<GetScheduledRoomsResponse>;
    getRoomUsers: () => Promise<UserList>;
  };
  mutation: {
    joinRoomAndGetInfo: (
      roomId: string
    ) => Promise<
      | JoinRoomAndGetInfoResponse
      | {
          error: string;
        }
    >;
    speakingChange: (value: boolean) => void;
    follow: (userId: string, value: boolean) => Promise<void>;
    sendRoomChatMsg: (
      ast: MessageToken[],
      whisperedTo?: string[]
    ) => Promise<void>;
    setMute: (isMuted: boolean) => Promise<Record<string, never>>;
    leaveRoom: () => Promise<{
      roomId: UUID;
    }>;
    createRoom: (data: {
      name: string;
      privacy: string;
      description: string;
    }) => Promise<
      | {
          error: string;
        }
      | {
          room: Room;
        }
    >;
    editRoom: (data: {
      name: string;
      privacy: string;
      description: string;
    }) => Promise<
      | {
          error: string;
        }
      | {
          room: Room;
        }
    >;
  };
};
