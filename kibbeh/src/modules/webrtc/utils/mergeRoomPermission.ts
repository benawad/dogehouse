import { RoomPermissions } from "@dogehouse/kebab";

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
