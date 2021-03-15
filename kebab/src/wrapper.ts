// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { MessageToken, Room, UUID } from "./entities";

export const wrap = (connection: Connection) => ({
  getTopPublicRooms: (): Promise<Room[]> =>
    connection.fetch("get_top_public_rooms", { cursor: 0 }).then(data => data.rooms),
  joinRoom: (id: UUID): Promise<void> =>
    connection.fetch("join_room", { roomId: id }, "join_room_done"),
  sendRoomChatMsg: (ast: MessageToken[], whisperedTo: string[] = []): Promise<void> =>
    connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
});
