import { atom, useAtom, WritableAtom } from "jotai";
import { useCurrentRoomStore } from "../webrtc/stores/useCurrentRoomStore";
import { Room, BaseUser, UserWithFollowInfo } from "./types";

const createSetter = <T>(a: WritableAtom<T, any>) =>
  atom(null, (get, set, fn: (x: T) => T) => {
    set(a, typeof fn === "function" ? fn(get(a)) : fn);
  });

export const voiceBrowserStatusAtom = atom(-1);
export const setVoiceBrowserStatusAtom = createSetter(voiceBrowserStatusAtom);
export const meAtom = atom<BaseUser | null>(null);
export const setMeAtom = createSetter(meAtom);
export const inviteListAtom = atom<{
  users: BaseUser[];
  nextCursor: number | null;
}>({ users: [], nextCursor: null });
export const setInviteListAtom = createSetter(inviteListAtom);
export const followingOnlineAtom = atom<{
  users: UserWithFollowInfo[];
  nextCursor: number | null;
}>({ users: [], nextCursor: null });
export const userSearchAtom = atom<{
  loading: boolean;
  users: BaseUser[];
  nextCursor: number | null;
}>({ users: [], loading: false, nextCursor: null });
export const setFollowingOnlineAtom = createSetter(followingOnlineAtom);
export const followerMapAtom = atom<
  Record<
    string,
    {
      users: UserWithFollowInfo[];
      nextCursor: number | null;
    }
  >
>({});
export const followingMapAtom = atom<
  Record<
    string,
    {
      users: UserWithFollowInfo[];
      nextCursor: number | null;
    }
  >
>({});
export const setFollowingMapAtom = createSetter(followingMapAtom);
export const setFollowerMapAtom = createSetter(followerMapAtom);
export const publicRoomsAtom = atom<{
  publicRooms: Room[];
  nextCursor: number | null;
}>({ publicRooms: [], nextCursor: null });
export const setPublicRoomsAtom = createSetter(publicRoomsAtom);
export const useCurrentRoomInfo = () => {
  const { currentRoom: room } = useCurrentRoomStore();
  const [me] = useAtom(meAtom);

  if (!room || !me) {
    return {
      isMod: false,
      isCreator: false,
      isSpeaker: false,
      canSpeak: false,
    };
  }

  let isMod = false;
  let isSpeaker = false;

  for (const u of room.users) {
    if (u.id === me.id) {
      if (u.roomPermissions?.isSpeaker) {
        isSpeaker = true;
      }
      if (u.roomPermissions?.isMod) {
        isMod = true;
      }
      break;
    }
  }

  const isCreator = me.id === room.creatorId;

  return {
    isCreator,
    isMod,
    isSpeaker,
    canSpeak: isCreator || isSpeaker,
  };
};
