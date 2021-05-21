import { Room, User } from "../..";

export default interface Requests {
  search: {
    request: { query: string },
    reply: { items: Array<Room | User>, rooms: Room[], users: User[] }
  },
}
