import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useTypeSafeMutation } from "../../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { useTypeSafeUpdateQuery } from "../../shared-hooks/useTypeSafeUpdateQuery";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { InfoText } from "../../ui/InfoText";
import { SingleUser } from "../../ui/UserAvatar";

interface BlockedFromRoomUsersProps {}

export const GET_BLOCKED_FROM_ROOM_USERS = "get_blocked_from_room_users";

const UnbanButton = ({
  userId,
  offset,
}: {
  userId: string;
  offset: number;
}) => {
  const updater = useTypeSafeUpdateQuery();
  const { mutateAsync, isLoading } = useTypeSafeMutation("unbanFromRoom", {
    onSuccess: () => {
      updater(["getBlockedFromRoomUsers", offset], (d) => {
        if (!d) {
          return d;
        }

        return {
          ...d,
          users: d.users.filter((x) => x.id !== userId),
        };
      });
    },
  });
  const { t } = useTypeSafeTranslation();

  return (
    <Button
      loading={isLoading}
      onClick={() => {
        mutateAsync([userId]);
      }}
      size={`small`}
    >
      {t("components.blockedFromRoomUsers.unban")}
    </Button>
  );
};
export const BlockedFromRoomUsersPage: React.FC<{
  offset: number;
  onLoadMore: (newOffset: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}> = ({ offset, onLoadMore, isOnlyPage, isLastPage }) => {
  const { isLoading, data } = useTypeSafeQuery(
    ["getBlockedFromRoomUsers", offset],
    { enabled: false },
    [offset]
  );
  const { t } = useTypeSafeTranslation();

  if (isLoading) {
    return <CenterLoader />;
  }

  if (isOnlyPage && data?.users.length === 0) {
    return (
      <InfoText className={`mt-2`}>
        {t("components.blockedFromRoomUsers.noBans")}
      </InfoText>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {data.users.map((profile) => (
        <div
          className={`flex border-b border-solid w-full py-4 px-2 items-center`}
          key={profile.id}
        >
          <div className="flex">
            <SingleUser size="md" src={profile.avatarUrl} />
          </div>
          <div className={`flex ml-4 flex-1 mr-4`}>
            <div className={`flex text-lg font-bold`}>
              {profile.displayName}
            </div>
            <div style={{ color: "" }} className={`flex font-mono font-light`}>
              &nbsp;(@{profile.username})
            </div>
          </div>
          <UnbanButton offset={offset} userId={profile.id} />
        </div>
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex items-center justify-center mt-4`}>
          <Button
            size="small"
            onClick={() => {
              onLoadMore(data.nextCursor!);
            }}
          >
            {t("common.loadMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const BlockedFromRoomUsers: React.FC<BlockedFromRoomUsersProps> = ({}) => {
  const [offsets, setOffsets] = React.useState([0]);
  const { t } = useTypeSafeTranslation();

  return (
    <>
      <div className={`flex mt-4 flex-col text-primary-100 pt-3`}>
        <h1 className={`text-xl`}>
          {t("components.blockedFromRoomUsers.header")}
        </h1>
        <div className="flex flex-col">
          {offsets.map((offset, i) => (
            <BlockedFromRoomUsersPage
              key={offset}
              offset={offset}
              isLastPage={i === offsets.length - 1}
              isOnlyPage={offsets.length === 1}
              onLoadMore={(o) => setOffsets([...offsets, o])}
            />
          ))}
        </div>
      </div>
    </>
  );
};
