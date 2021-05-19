// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck because internet is unpredictable

import {
  Message,
  MessageToken,
  BooleanMap,
  Room,
  ScheduledRoom,
  User,
  UserWithFollowInfo,
  UUID,
} from "..";
import { ChatMode } from "../entities";
import { Connection } from "./raw";
import {
  GetScheduledRoomsResponse,
  GetTopPublicRoomsResponse,
  JoinRoomAndGetInfoResponse,
  GetRoomUsersResponse,
  NewRoomDetailsResponse,
  InvitationToRoomResponse,
  CreateBotResponse,
} from "./responses";

/**
 * Allows you to handle custom logic on websocket events
 */
type Handler<Data> = (data: Data) => void;

/**
 * A wrapper object created using `wrap()` that can be used to make websocket calls using functions
 */
export type Wrapper = ReturnType<typeof wrap>;

/**
 * Creates a wrapper object that allows you to make websocket calls using functions
 * @param {Connection} connection reference to the websocket connection
 * @returns  {connection} Wrapper object
 */
export const wrap = (connection: Connection) => ({
  connection,

  /**
   * Allows you to subscribe to various pre-defined websocket events
   */
  subscribe: {
    newChatMsg: (handler: Handler<{ userId: UUID; msg: Message }>) =>
      connection.addListener("new_chat_msg", handler),
    newRoomDetails: (handler: Handler<NewRoomDetailsResponse>) =>
      connection.addListener("new_room_details", handler),
    userJoinRoom: (handler: Handler<{ user: User }>) =>
      connection.addListener("new_user_join_room", handler),
    userLeaveRoom: (handler: Handler<{ userId: UUID; roomId: UUID }>) =>
      connection.addListener("user_left_room", handler),
    invitationToRoom: (handler: Handler<InvitationToRoomResponse>) =>
      connection.addListener("invitation_to_room", handler),
    handRaised: (handler: Handler<{ userId: UUID }>) =>
      connection.addListener("hand_raised", handler),
    speakerAdded: (
      handler: Handler<{
        userId: UUID;
        muteMap: BooleanMap;
        deafMap: BooleanMap;
      }>
    ) => connection.addListener("speaker_added", handler),
    speakerRemoved: (
      handler: Handler<{
        userId: UUID;
        muteMap: BooleanMap;
        deafMap: BooleanMap;
      }>
    ) => connection.addListener("speaker_removed", handler),
  },

  /**
   * Allows you to call functions that return information about the ws state
   */

  query: {
    search: (
      query: string
    ): Promise<{
      items: Array<User | Room>;
      rooms: Room[];
      users: User[];
    }> => connection.fetch("search", { query }),
    getMyScheduledRoomsAboutToStart: (
      roomId: string
    ): Promise<{ scheduledRooms: ScheduledRoom[] }> =>
      connection.fetch("get_my_scheduled_rooms_about_to_start", { roomId }),
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
    ): Promise<UserWithFollowInfo | null | { error: string }> =>
      connection.fetch("get_user_profile", { userId: idOrUsername }),
    getScheduledRooms: (
      cursor = "",
      range: "all" | "upcoming" = "all",
      userId: string | undefined,
    ): Promise<GetScheduledRoomsResponse> =>
      connection.sendCall("room:get_scheduled", {
        cursor,
        range,
        userId,
      }),
    getRoomUsers: (): Promise<GetRoomUsersResponse> =>
      connection.fetch(
        "get_current_room_users",
        {},
        "get_current_room_users_done"
      ),
  },

  /**
   * Allows you to call functions that mutate the ws state
   */
  mutation: {
    userUpdate: (data: Partial<User>): Promise<void> =>
      connection.sendCall("user:update", data),
    userBlock: (userId: string): Promise<void> =>
      connection.sendCall("user:block", { userId }),
    userUnblock: (userId: string): Promise<void> =>
      connection.sendCall("user:unblock", { userId }),
    roomUpdate: (data: {
      name?: string;
      privacy?: string;
      chatThrottle?: number;
      description?: string;
      autoSpeaker?: boolean;
      chatMode?: ChatMode;
    }): Promise<void> => connection.sendCall("room:update", data),
    roomBan: (userId: string, shouldBanIp?: boolean): Promise<void> =>
      connection.sendCast("room:ban", { userId, shouldBanIp }),
    setDeaf: (isDeafened: boolean): Promise<Record<string, never>> =>
      connection.sendCall("room:deafen", { deafened: isDeafened }),
    userCreateBot: (username: string): Promise<CreateBotResponse> =>
      connection.sendCall(`user:create_bot`, { username }),
    userAdminUpdate: (
      id: UUID,
      user: {
        staff?: boolean;
        contributions?: number;
      }
    ) =>
      connection.sendCall(`user:admin_update`, {
        id,
        user,
      }),
    ban: (username: string, reason: string) =>
      connection.send(`ban`, { username, reason }),
    deleteScheduledRoom: (id: string): Promise =>
      connection.fetch(`delete_scheduled_room`, { id }),
    createRoomFromScheduledRoom: (data: {
      id: string;
      name: string;
      description: string;
    }): Promise<{ room: Room }> =>
      connection.fetch(`create_room_from_scheduled_room`, data),
    createScheduledRoom: (data: {
      name: string;
      description: string;
      scheduledFor: string;
    }): Promise<{ error: string } | ScheduledRoom> =>
      connection.fetch(`schedule_room`, data),
    editScheduledRoom: (
      id: string,
      data: {
        name: string;
        description: string;
        scheduledFor: string;
      }
    ): Promise<{ error: string } | ScheduledRoom> =>
      connection.fetch(`edit_scheduled_room`, { id, data }),
    askToSpeak: () => connection.send(`ask_to_speak`, {}),
    inviteToRoom: (userId: string) =>
      connection.send(`invite_to_room`, { userId }),
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
    unbanFromRoomChat: (userId: string): Promise<void> =>
      connection.send("unban_from_room_chat", { userId }),
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
      bannerUrl?: string;
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
