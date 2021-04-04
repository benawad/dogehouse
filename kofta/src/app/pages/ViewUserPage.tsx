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
import { RoomUser } from "../types";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { useUserProfileQuery } from "../utils/useUserProfileQuery";

export const ViewUserPage = () => {
  const { t } = useTypeSafeTranslation();
  const { status } = useSocketStatus();
  const { state: profileFromState } = useLocation<RoomUser>();
  const {
    params: { username },
  } = useRouteMatch<{ username: string }>();

  const isDirectFromUrl = !profileFromState && !!username;

  const { isLoading, data: profileFromDB } = useUserProfileQuery(username , isDirectFromUrl && status === "auth-good" );
  
  const {data: followData} = useQuery<any>(
    ["follow_info", profileFromDB?.id],
    () =>
        wsFetch<any>({
            op: "follow_info",
            d: { userId: profileFromDB?.id},
        }),
    { enabled: isDirectFromUrl && status === "auth-good" && !!profileFromDB }
  );

  if(profileFromDB){
    profileFromDB.youAreFollowing = followData?.youAreFollowing;
  }

  const profile = profileFromState || profileFromDB;

  return (
    <Wrapper>
      <Backbar actuallyGoBack={!isDirectFromUrl} />
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
