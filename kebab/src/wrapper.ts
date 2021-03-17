// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { Message, MessageToken, UUID } from "./entities";

type Handler<Data> = (data: Data) => void;

export const wrap = (connection: Connection) => ({
  subscribe: {
    newChatMsg: (handler: Handler<{ userId: UUID; msg: Message }>) =>
      connection.addListener("new_chat_msg", handler),
  },
  getTopPublicRooms: (cursor = 0): Promise<GetTopPublicRoomsResponse> =>
    connection.fetch("get_top_public_rooms", { cursor }),
  joinRoom: (id: UUID): Promise<void> =>
    connection.fetch("join_room", { roomId: id }, "join_room_done"),
  sendRoomChatMsg: (
    ast: MessageToken[],
    whisperedTo: string[] = []
  ): Promise<void> =>
    connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
  leaveRoom: (): Promise<{ roomId: UUID }> =>
    connection.fetch("leave_room", {}, "you_left_room"),
});
