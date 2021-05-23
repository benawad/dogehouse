import { Relationship, User, UUID, PaginatedReply, PaginatedRequest } from "../..";

export default interface Requests {
  create_bot: {
    request: {
      username: string
    },
    reply: {
      apiKey: string,
      isUsernameTaken: boolean
    }
  },
  ban: {
    request: {
      userId: UUID,
      reason: string
    },
    reply: {
      apiKey: string,
      isUsernameTaken: boolean
    }
  },
  block: {
    request: {
      userId: UUID
    },
    reply: {
      blocked: UUID[]
    }
  },
  unblock: {
    request: {
      userId: UUID
    }
  },
  follow: {
    request: {
      userId: string
    }
  }
  get_following: {
    request: { username: string } & PaginatedRequest,
    reply: { following: User } & PaginatedReply
  }
  get_followers: {
    request: { username: string } & PaginatedRequest,
    reply: { followers: User } & PaginatedReply
  }
  update: {
    request: User,
    reply: User
  }
  get_info: {
    request: { userIdOrUsername: string },
    reply: {
      username: string,
      displayName: string,
      avatarUrl: string,
      bannerUrl: string,
      bio: string,
      currentRoomId: UUID,
      numFollowing: number,
      numFollowers: number,
      online: boolean,
      lastOnline: string,
      youAreFollowing?: boolean,
      followsYou?: boolean,
      iBlockedThem?: boolean
    }
  }
  get_relationship: {
    request: { userId: UUID },
    reply: { relationship: Relationship[] }
  },
  unfollow: {
    request: { userId: UUID }
  },
}
