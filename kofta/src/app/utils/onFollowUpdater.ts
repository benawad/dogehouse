import { auth_query } from "../../createWebsocket";
import { queryClient } from "../queryClient";
import { CurrentRoom, BaseUser, UserWithFollowInfo } from "../types";

export const onFollowUpdater = (
	setRoom: (update: (x: CurrentRoom | null) => CurrentRoom | null) => void,
	me: BaseUser | null | undefined,
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
	queryClient.setQueryData<{ user: BaseUser } | null | undefined>(
		auth_query,
		(x) =>
			!x
				? x
				: {
						...x,
						user: {
							...x.user,
							numFollowing:
								x.user.numFollowing + (profile.youAreFollowing ? -1 : 1),
						},
				  }
	);
};
