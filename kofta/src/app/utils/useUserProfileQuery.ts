import { useQuery } from "react-query";
import { wsFetch } from "../../createWebsocket";
import { UserWithFollowInfo } from "../types";

export const useUserProfileQuery = (userId: string, enabled: boolean) => useQuery<UserWithFollowInfo>(
    ["get_user_profile", userId],
    () =>
        wsFetch<any>({
            op: "get_user_profile",
            d: { userId },
        }),
    { enabled }
);
