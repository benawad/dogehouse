import React from "react";
import { useQuery } from "react-query";
import { useLocation, useRouteMatch } from "react-router-dom";
import { wsFetch } from "../../createWebsocket";
import { useSocketStatus } from "../../webrtc/stores/useSocketStatus";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Spinner } from "../components/Spinner";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { RoomUser, UserWithFollowInfo } from "../types";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

export const ViewUserPage = () => {
  const { t } = useTypeSafeTranslation();
  const { status } = useSocketStatus();
  const { state: profileFromState } = useLocation<RoomUser>();
  const {
    params: { username },
  } = useRouteMatch<{ username: string }>();

  const { data: profileFromDB, isLoading } = useQuery<UserWithFollowInfo>(
    ["get_user_profile", username],
    () => {
      return wsFetch<any>({
        op: "get_user_profile",
        d: { userId: username },
      });
    },
    { enabled: !profileFromState && status === "auth-good" && !!username }
  );

  const profile = profileFromState || profileFromDB;

  return (
    <Wrapper>
      <Backbar actuallyGoBack />
      <BodyWrapper>
        {isLoading ? (
          <Spinner />
        ) : profile ? (
          <UserProfile profile={profile} />
        ) : (
          <div className={`mt-8 text-xl ml-4`}>{t("common.noUsersFound")}</div>
        )}
      </BodyWrapper>
    </Wrapper>
  );
};
