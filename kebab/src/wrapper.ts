// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { Message, MessageToken, Room, UUID } from "./entities";

type Handler<Data> = (data: Data) => void;

export const wrap = (connection: Connection) => ({
  subscribe: {
    newChatMsg: (handler: Handler<{ userId: UUID, msg: Message }>) =>
      connection.addListener("new_chat_msg", handler),
  },
  getTopPublicRooms: (): Promise<Room[]> =>
    connection.fetch("get_top_public_rooms", { cursor: 0 }).then(data => data.rooms),
  joinRoom: (id: UUID): Promise<void> =>
    connection.fetch("join_room", { roomId: id }, "join_room_done"),
  sendRoomChatMsg: (ast: MessageToken[], whisperedTo: string[] = []): Promise<void> =>
    connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
});
