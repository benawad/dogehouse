// @ts-nocheck because internet is unpredictable

import { Connection } from "./raw";
import { MessageToken, UUID } from "./entities";

export const wrap = (connection: Connection) => ({
  getTopPublicRooms: (cursor = 0): Promise<GetTopPublicRoomsResponse> =>
    connection.fetch("get_top_public_rooms", { cursor }),
  joinRoom: (id: UUID): Promise<void> =>
    connection.fetch("join_room", { roomId: id }, "join_room_done"),
  sendRoomChatMsg: (
    ast: MessageToken[],
    whisperedTo: string[] = []
  ): Promise<void> =>
    connection.send("send_room_chat_msg", { tokens: ast, whisperedTo }),
});
