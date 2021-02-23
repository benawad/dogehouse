import { RoomPermissions } from "@dogehouse/feta/types";

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
