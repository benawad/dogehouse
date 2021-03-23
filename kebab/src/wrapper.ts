// @ts-nocheck because internet is unpredictable

import {
  Message,
  MessageToken,
  Room,
  UserWithFollowInfo,
  UUID,
} from "./entities";
import { Connection } from "./raw";
import {
  GetScheduledRoomsResponse,
  GetTopPublicRoomsResponse,
  JoinRoomAndGetInfoResponse,
} from "./responses";

type Handler<Data> = (data: Data) => void;

export type Wrapper = ReturnType<typeof wrap>;

export const wrap = (connection: Connection) => ({
  connection,
  subscribe: {
    newChatMsg: (handler: Handler<{ userId: UUID; msg: Message }>) =>
      connection.addListener("new_chat_msg", handler),
  },
  query: {
    getFollowingOnline: (
      cursor = 0
    ): Promise<{
      users: UserWithFollowInfo[];
      nextCursor: number | null;
    }> => connection.fetch("fetch_following_online", { cursor }),
    joinRoomAndGetInfo: (
      roomId: string
    ): Promise<JoinRoomAndGetInfoResponse | { error: string }> =>
      connection.fetch("join_room_and_get_info", { roomId }),
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
  },
  mutation: {
    speakingChange: (value: boolean) =>
      connection.send(`speaking_change`, { value }),
    follow: (userId: string, value: boolean): Promise<void> =>
      connection.fetch("follow", { userId, value }),
    sendRoomChatMsg: (
      ast: MessageToken[],
      whisperedTo: string[] = []
    ): Promise<void> =>
      connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
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
    editRoom: (data: {
      name: string;
      privacy: string;
      description: string;
    }): Promise<{ error: string } | { room: Room }> =>
      connection.fetch("edit_room", data),
  },
});
