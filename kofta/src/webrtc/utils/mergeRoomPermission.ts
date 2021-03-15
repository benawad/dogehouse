import { RoomPermissions } from "../../app/types";

export const mergeRoomPermission = (
  currentRoomPermission: RoomPermissions | null | undefined,
  newRoomPermissions: Partial<RoomPermissions>
) => {
  return {
    ...(currentRoomPermission || {
      askedToSpeak: false,
      isMod: false,
      isSpeaker: false,
    }),
    ...newRoomPermissions,
  };
};
