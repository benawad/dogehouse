import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { UserProfile } from "../components/UserProfile";
import { Wrapper } from "../components/Wrapper";
import { RoomUser } from "../types";
import { useUserProfileQuery } from "../utils/useUserProfileQuery";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import { useSocketStatus } from "../../webrtc/stores/useSocketStatus";
import { wsFetch } from "../../createWebsocket";
interface userPageParams {
    id:string;
}

export const ViewUserPage = () => {
  const { state } = useLocation<RoomUser>();
  const { status } = useSocketStatus();
  const { id } = useParams<userPageParams>();
  const { t } = useTypeSafeTranslation();
  const isProfileUrl = !!id;
  const { isLoading, data: profileFromDB } = useUserProfileQuery(id , isProfileUrl && status === "auth-good");
  const {data: followData} = useQuery<any>(
    ["follow_info", id],
    () =>
        wsFetch<any>({
            op: "follow_info",
            d: { userId: id},
        }),
    { enabled: isProfileUrl && status === "auth-good" }
  );
  
  if(profileFromDB){
    profileFromDB.youAreFollowing = followData?.youAreFollowing;
  }

  if (!state && !profileFromDB || isLoading) {
    return <div className={`mt-8`}>{t("common.loading")}</div>;
  }

  return (
    <Wrapper>
      <Backbar actuallyGoBack={!isProfileUrl} />
      <BodyWrapper>
        <UserProfile profile={state || profileFromDB} />
      </BodyWrapper>
    </Wrapper>
  );
};
