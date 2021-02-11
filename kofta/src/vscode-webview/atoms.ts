import { atom, WritableAtom } from "jotai";
import { CurrentRoom, Room, User } from "./types";

const createSetter = <T>(a: WritableAtom<T, any>) =>
  atom(null, (get, set, fn: (x: T) => T) => {
    set(a, typeof fn === "function" ? fn(get(a)) : fn);
  });

export const voiceBrowserStatusAtom = atom(-1);
export const setVoiceBrowserStatusAtom = createSetter(voiceBrowserStatusAtom);
export const meAtom = atom<User | null>(null);
export const setMeAtom = createSetter(meAtom);
export const inviteListAtom = atom<{
  users: User[];
  nextCursor: number | null;
}>({ users: [], nextCursor: null });
export const setInviteListAtom = createSetter(inviteListAtom);
export const followingOnlineAtom = atom<{
  users: User[];
  nextCursor: number | null;
}>({ users: [], nextCursor: null });
export const setFollowingOnlineAtom = createSetter(followingOnlineAtom);
export const followerMapAtom = atom<
  Record<
    string,
    {
      users: User[];
      nextCursor: number | null;
    }
  >
>({});
export const followingMapAtom = atom<
  Record<
    string,
    {
      users: User[];
      nextCursor: number | null;
    }
  >
>({});
export const setFollowingMapAtom = createSetter(followingMapAtom);
export const setFollowerMapAtom = createSetter(followerMapAtom);
export const currentRoomAtom = atom<CurrentRoom | null>(null);
export const setCurrentRoomAtom = createSetter(currentRoomAtom);
export const publicRoomsAtom = atom<{
  publicRooms: Room[];
  nextCursor: number | null;
}>({ publicRooms: [], nextCursor: null });
export const setPublicRoomsAtom = createSetter(publicRoomsAtom);
export const myCurrentRoomInfoAtom = atom((get) => {
  const room = get(currentRoomAtom);
  const me = get(meAtom);
  if (!room || !me) {
    return {
      isMod: false,
      isCreator: false,
      canSpeak: false,
    };
  }

  let canSpeak = false;
  let isMod = false;

  for (const u of room.users) {
    if (u.id === me.id) {
      if (u.canSpeakForRoomId === room.id) {
        canSpeak = true;
      }
      if (u.modForRoomId === room.id) {
        isMod = true;
      }
      break;
    }
  }

  return {
    isCreator: me.id === room.creatorId,
    isMod,
    canSpeak,
  };
});
