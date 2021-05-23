import { MessageToken, UUID } from "../..";

export default interface Requests {
  ban: {
    request: { userId: UUID }
  },
  unban: {
    request: { userId: UUID }
  },
  send_msg: {
    request: {
      tokens: MessageToken[],
      whisperedTo: UUID[],
      isWhisper?: boolean
    }
  },
  delete: {
    request: { messageId: UUID }
  },
}
