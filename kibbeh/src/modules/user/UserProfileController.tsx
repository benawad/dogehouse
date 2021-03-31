import { useRouter } from "next/router";
import React from "react";
import { isServer } from "../../lib/isServer";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { CenterLoader } from "../../ui/CenterLoader";
import { VerticalUserInfoWithFollowButton } from "./VerticalUserInfoWithFollowButton";

interface UserProfileControllerProps {}

export const UserProfileController: React.FC<UserProfileControllerProps> = ({}) => {
  const { query } = useRouter();
  const { data, isLoading } = useTypeSafeQuery(
    ["getUserProfile", query.username as string],
    {
      enabled:
        typeof query.username === "string" && !!query.username && !isServer,
      refetchOnMount: "always",
    },
    [query.username as string]
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    // @todo needs to be designed
    return <div>could not find user</div>;
  }

  return (
    <VerticalUserInfoWithFollowButton
      idOrUsernameUsedForQuery={data.username}
      user={data}
    />
  );
};
