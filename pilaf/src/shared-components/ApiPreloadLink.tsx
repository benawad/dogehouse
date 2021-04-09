import React from "react";
import { useTypeSafePrefetch } from "../shared-hooks/useTypeSafePrefetch";

type Prefetch = ReturnType<typeof useTypeSafePrefetch>;

const handlers = {
  following: ({ username }: { username: string }) => ({
    href: "/u/[username]/following",
    as: `/u/${username}/following`,
    onClick: (prefetch: Prefetch) =>
      prefetch("getFollowList", [username, true, 0]),
  }),
  followers: ({ username }: { username: string }) => ({
    href: "/u/[username]/followers",
    as: `/u/${username}/followers`,
    onClick: (prefetch: Prefetch) =>
      prefetch("getFollowList", [username, false, 0]),
  }),
  profile: ({ username }: { username: string }) => ({
    href: "/u/[username]",
    as: `/u/${username}`,
    onClick: (prefetch: Prefetch) => prefetch("getUserProfile", [username]),
  }),
  room: ({ id }: { id: string }) => ({
    href: "/room/[id]",
    as: `/room/${id}`,
    onClick: (prefetch: Prefetch) => prefetch("joinRoomAndGetInfo", [id]),
  }),
};

type Handler = typeof handlers;

type ValueOf<T> = T[keyof T];
type DifferentProps = {
  [K in keyof Handler]: {
    route: K;
    data: Parameters<Handler[K]>[0];
  };
};

// the purpose of this component is to start the query to the api before navigating to the page
// this will result in less loading time for the user
export const ApiPreloadLink: React.FC<ValueOf<DifferentProps>> = ({
  children,
  route,
  data,
}) => {
  const prefetch = useTypeSafePrefetch();

  const { as, href, onClick } = handlers[route](data);

  return (
    <></>
    // <Link href={href} as={as}>
    //   <a onClick={() => onClick(prefetch)}>{children}</a>
    // </Link>
  );
};
