import { BooleanMap, Message, RoomDetails, User, UUID } from "../../entities";

export default interface Events {
  new_chat_msg: { userId: UUID, msg: Message },
  new_room_details: RoomDetails,
  new_user_join_room: { user: User },
  user_left_room: { userId: UUID },
  invitation_to_room: {
    type: "invite";
    username: string;
    displayName: string;
    avatarUrl: string;
    bannerUrl: string;
    roomName: string;
    roomId: UUID;
  },
  hand_raised: { userId: UUID },
  speaker_added: {
    userId: UUID;
    muteMap: BooleanMap;
    deafMap: BooleanMap;
  },
  speaker_removed: {
    userId: UUID;
    muteMap: BooleanMap;
    deafMap: BooleanMap;
  }
}
