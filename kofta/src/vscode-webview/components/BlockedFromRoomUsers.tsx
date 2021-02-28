import React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { wsFetch, wsMutation } from "../../createWebsocket";
import { PaginatedBaseUsers } from "../types";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

interface BlockedFromRoomUsersProps {}

export const GET_BLOCKED_FROM_ROOM_USERS = "get_blocked_from_room_users";

const UnbanButton = ({
  userId,
  offset,
}: {
  userId: string;
  offset: number;
}) => {
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading } = useMutation(wsMutation, {
    onSuccess: () => {
      queryClient.setQueryData<PaginatedBaseUsers | undefined>(
        [GET_BLOCKED_FROM_ROOM_USERS, offset],
        (d) => {
          if (!d) {
            return d;
          }

          return {
            ...d,
            users: d.users.filter((x) => x.id !== userId),
          };
        }
      );
    },
  });

  return (
    <Button
      loading={isLoading}
      onClick={() => {
        mutateAsync({ op: "unban_from_room", d: { userId } });
      }}
      variant={`small`}
    >
      unban
    </Button>
  );
};
export const BlockedFromRoomUsersPage: React.FC<{
  offset: number;
  onLoadMore: (newOffset: number) => void;
  isLastPage: boolean;
  isOnlyPage: boolean;
}> = ({ offset, onLoadMore, isOnlyPage, isLastPage }) => {
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery<PaginatedBaseUsers>(
    [GET_BLOCKED_FROM_ROOM_USERS, offset],
    () =>
      wsFetch<PaginatedBaseUsers>({
        op: GET_BLOCKED_FROM_ROOM_USERS,
        d: { offset },
      }),
    { enabled: false }
  );

  if (isLoading) {
    return <div className={`mt-8`}>loading...</div>;
  }

  if (isOnlyPage && data?.users.length === 0) {
    return <div className={`mt-2`}>no one has been banned yet</div>;
  }

  if (!data || !data.users.length) {
    return null;
  }

  return (
    <>
      {data.users.map((profile) => (
        <div
          className={`border-b border-solid border-simple-gray-3c flex py-4 px-2 items-center`}
          key={profile.id}
        >
          <div>
            <Avatar size={60} src={profile.avatarUrl} />
          </div>
          <div className={`ml-4 flex-1 mr-4`}>
            <div className={`text-lg`}>{profile.displayName}</div>
            <div style={{ color: "" }}>@{profile.username}</div>
          </div>
          <UnbanButton offset={offset} userId={profile.id} />
        </div>
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex items-center justify-center mt-4`}>
          <Button
            variant="small"
            onClick={() => {
              queryClient.prefetchQuery(
                [GET_BLOCKED_FROM_ROOM_USERS, data.nextCursor],
                () =>
                  wsFetch<PaginatedBaseUsers>({
                    op: GET_BLOCKED_FROM_ROOM_USERS,
                    d: { offset: data.nextCursor },
                  }),
                { staleTime: 0 }
              );
              onLoadMore(data.nextCursor!);
            }}
          >
            load more
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const BlockedFromRoomUsers: React.FC<BlockedFromRoomUsersProps> = ({}) => {
  const [offsets, setOffsets] = React.useState([0]);

  return (
    <>
      <div className={`mt-4`}>
        <h1 className={`text-xl`}>Banned Users</h1>
        <div>
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
