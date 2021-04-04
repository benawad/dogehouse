// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck because internet is unpredictable

import {
  Message,
  MessageToken,
  Room,
  User,
  UserWithFollowInfo,
  UUID,
} from "./entities";
import { Connection } from "./raw";
import {
  GetScheduledRoomsResponse,
  GetTopPublicRoomsResponse,
  JoinRoomAndGetInfoResponse,
  GetRoomUsersResponse,
  NewRoomDetailsResponse,
} from "./responses";

type Handler<Data> = (data: Data) => void;

export type Wrapper = ReturnType<typeof wrap>;

export const wrap = (connection: Connection) => ({
  connection,
  subscribe: {
    newChatMsg: (handler: Handler<{ userId: UUID; msg: Message }>) =>
      connection.addListener("new_chat_msg", handler),
    newRoomDetails: (handler: Handler<NewRoomDetailsResponse>) =>
      connection.addListener("new_room_details", handler),
    userJoinRoom: (handler: Handler<{ user: User }>) =>
      connection.addListener("new_user_join_room", handler),
    userLeaveRoom: (handler: Handler<{ userId: UUID; roomId: UUID }>) =>
      connection.addListener("user_left_room", handler),
  },
  query: {
    joinRoomAndGetInfo: (
      roomId: string
    ): Promise<JoinRoomAndGetInfoResponse | { error: string }> =>
      connection.fetch("join_room_and_get_info", { roomId }),
    getInviteList: (
      cursor = 0
    ): Promise<{
      users: User[];
      nextCursor: number | null;
    }> => connection.fetch("get_invite_list", { cursor }),
    getFollowList: (
      username: string,
      isFollowing: boolean,
      cursor = 0
    ): Promise<{
      users: UserWithFollowInfo[];
      nextCursor: number | null;
    }> =>
      connection.fetch("get_follow_list", { username, isFollowing, cursor }),
    getBlockedFromRoomUsers: (
      cursor = 0
    ): Promise<{
      users: User[];
      nextCursor: number | null;
    }> => connection.fetch("get_blocked_from_room_users", { offset: cursor }),
    getMyFollowing: (
      cursor = 0
    ): Promise<{
      users: UserWithFollowInfo[];
      nextCursor: number | null;
    }> => connection.fetch("get_my_following", { cursor }),
    getTopPublicRooms: (cursor = 0): Promise<GetTopPublicRoomsResponse> =>
      connection.fetch("get_top_public_rooms", { cursor }),
    getUserProfile: (
      idOrUsername: string
    ): Promise<UserWithFollowInfo | null> =>
      connection.fetch("get_user_profile", { userId: idOrUsername }),
    getScheduledRooms: (
      cursor: "" | number = "",
      getOnlyMyScheduledRooms = false
    ): Promise<GetScheduledRoomsResponse> =>
      connection.fetch("get_scheduled_rooms", {
        cursor,
        getOnlyMyScheduledRooms,
      }),
    getRoomUsers: (): Promise<GetRoomUsersResponse> =>
      connection.fetch(
        "get_current_room_users",
        {},
        "get_current_room_users_done"
      ),
  },
  mutation: {
    askToSpeak: () => connection.send(`ask_to_speak`, {}),
    inviteToRoom: (userId: string) =>
      connection.send(`invite_to_room`, { userId }),
    setAutoSpeaker: (value: boolean) =>
      connection.send(`set_auto_speaker`, { value }),
    speakingChange: (value: boolean) =>
      connection.send(`speaking_change`, { value }),
    unbanFromRoom: (userId: string): Promise<void> =>
      connection.fetch("unban_from_room", { userId }),
    follow: (userId: string, value: boolean): Promise<void> =>
      connection.fetch("follow", { userId, value }),
    sendRoomChatMsg: (
      ast: MessageToken[],
      whisperedTo: string[] = []
    ): Promise<void> =>
      connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
    changeModStatus: (userId: string, value: boolean): Promise<void> =>
      connection.send("change_mod_status", { userId, value }),
    changeRoomCreator: (userId: string): Promise<void> =>
      connection.send("change_room_creator", { userId }),
    addSpeaker: (userId: string): Promise<void> =>
      connection.send("add_speaker", { userId }),
    deleteRoomChatMessage: (userId: string, messageId: string): Promise<void> =>
      connection.send("delete_room_chat_message", { userId, messageId }),
    blockFromRoom: (userId: string): Promise<void> =>
      connection.send("block_from_room", { userId }),
    banFromRoomChat: (userId: string): Promise<void> =>
      connection.send("ban_from_room_chat", { userId }),
    setListener: (userId: string): Promise<void> =>
      connection.send("set_listener", { userId }),
    setMute: (isMuted: boolean): Promise<Record<string, never>> =>
      connection.fetch("mute", { value: isMuted }),
    leaveRoom: (): Promise<{ roomId: UUID }> =>
      connection.fetch("leave_room", {}, "you_left_room"),
    createRoom: (data: {
      name: string;
      privacy: string;
      description: string;
    }): Promise<{ error: string } | { room: Room }> =>
      connection.fetch("create_room", data),
    editProfile: (data: {
      displayName: string;
      username: string;
      bio: string;
      avatarUrl: string;
    }): Promise<{ isUsernameTaken: boolean }> =>
      connection.fetch("edit_profile", { data }),
    editRoom: (data: {
      name: string;
      privacy: string;
      description: string;
    }): Promise<{ error: string } | { room: Room }> =>
      connection.fetch("edit_room", data),
  },
});
