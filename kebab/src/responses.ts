import { Room, ScheduledRoom } from "./entities";

export type GetTopPublicRoomsResponse = {
  rooms: Room[];
  nextCursor: number | null;
};

export type GetScheduledRoomsResponse = {
  nextCursor: number | null;
  scheduledRooms: ScheduledRoom[];
};
