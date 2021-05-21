import { Room, RoomAuth, RoomRole, User, UUID, PaginatedReply, PaginatedRequest } from "../..";

export default interface Requests {
  invite: {
    request: { userId: UUID }
  },
  update: {
    request: { name: string, description: string, isPrivate: boolean, autoSpeaker?: boolean },
    reply: Room
  },
  get_invite_list: {
    request: PaginatedRequest,
    reply: { invites: User[] } & PaginatedReply
  },
  leave: void,
  ban: {
    request: { userId: UUID, shouldBadIp?: boolean }
  },
  set_role: {
    request: { userId: UUID, role: RoomRole }
  },
  set_auth: {
    request: { userId: UUID, level: RoomAuth }
  },
  join: {
    request: { roomId: UUID },
    reply: { name: string, description: string, isPrivate: boolean }
  },
  get_banned_users: {
    request: PaginatedRequest,
    reply: { users: User[] } & PaginatedReply
  },
  update_scheduled: {
    request: { name: string, scheduledFor: string, description: string },
    reply: unknown
  },
  delete_scheduled: {
    request: { roomId: UUID }
  },
  create: {
    request: {
      name: string,
      description: string,
      isPrivate?: boolean,
      userIdToInvite?: UUID[],
      autoSpeaker?: boolean,
      scheduledRoomId?: UUID
    },
    reply: Room
  },
  create_scheduled: {
    request: {
      name: string,
      scheduledFor: string,
      description?: string
    },
    reply: {
      id: UUID,
      name: string,
      scheduledFor: string,
      description: string
    }
  },
  unban: {
    request: { userId: UUID }
  },
  get_info: {
    request: { roomId?: UUID },
    reply: { name: string, description: string, isPrivate: boolean }
  },
  get_top: {
    request: PaginatedRequest,
    reply: { rooms: Room[] } & PaginatedReply
  },
  set_active_speaker: {
    request: void,
    reply: void
  },
  mute: {
    request: { muted: boolean }
  },
  deafen: {
    request: { deafened: boolean }
  },
  get_scheduled: {
    request: { range?: "all" | "upcoming", userId: UUID, cursor: number },
    reply: { rooms: Room[], nextCursor: number }
  },
}
