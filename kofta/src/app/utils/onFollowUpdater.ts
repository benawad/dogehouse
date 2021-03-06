import { SetStateAction } from "react";
import { CurrentRoom, BaseUser, UserWithFollowInfo } from "../types";

export const onFollowUpdater = (
  setRoom: (update: (x: CurrentRoom | null) => CurrentRoom | null) => void,
  setMe: (update: SetStateAction<BaseUser | null>) => void,
  me: BaseUser | null,
  profile: UserWithFollowInfo
) => {
  setRoom((r) =>
    !r
      ? r
      : {
          ...r,
          users: r.users.map((x) => {
            if (x.id === profile.id) {
              return {
                ...x,
                numFollowers:
                  x.numFollowers + (profile.youAreFollowing ? -1 : 1),
                youAreFollowing: !profile.youAreFollowing,
              };
            } else if (x.id === me?.id) {
              return {
                ...x,
                numFollowing:
                  x.numFollowing + (profile.youAreFollowing ? -1 : 1),
              };
            }

            return x;
          }),
        }
  );
  setMe((mu) =>
    !mu
      ? mu
      : {
          ...mu,
          numFollowing: mu.numFollowing + (profile.youAreFollowing ? -1 : 1),
        }
  );
};
