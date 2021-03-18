import { Room } from "./entities";

export type GetTopPublicRoomsResponse = {
  rooms: Room[];
  nextCursor: number | null;
};
