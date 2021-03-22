import { BaseUser, Room, RoomUser } from "@dogehouse/kebab";

export const useSplitUsersIntoSections = (room: Room, users: RoomUser[]) => {
  const speakers: BaseUser[] = [];
  const askingToSpeak: BaseUser[] = [];
  const listeners: BaseUser[] = [];
  let canIAskToSpeak = false;

  users.forEach((u) => {
    if (u.id === room.creatorId || u.roomPermissions?.isSpeaker) {
      speakers.push(u);
    } else if (u.roomPermissions?.askedToSpeak) {
      askingToSpeak.push(u);
    } else {
      canIAskToSpeak = true;
      listeners.push(u);
    }
  });

  return { speakers, listeners, askingToSpeak };
};
