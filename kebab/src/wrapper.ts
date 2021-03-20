// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { Message, MessageToken, Room, RoomUser, UUID } from "./entities";
import {
  GetTopPublicRoomsResponse,
  GetScheduledRoomsResponse,
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
    getCurrentRoomUsers: (): Promise<{
      users: RoomUser[];
      muteMap: Record<string, boolean>;
      roomId: string;
      activeSpeakerMap: Record<string, boolean>;
      autoSpeaker: boolean;
    }> => connection.fetch("get_current_room_users"),
    getTopPublicRooms: (cursor = 0): Promise<GetTopPublicRoomsResponse> =>
      connection.fetch("get_top_public_rooms", { cursor }),
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
    joinRoom: (id: UUID): Promise<void> =>
      connection.fetch("join_room", { roomId: id }, "join_room_done"),
    sendRoomChatMsg: (
      ast: MessageToken[],
      whisperedTo: string[] = []
    ): Promise<void> =>
      connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
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
