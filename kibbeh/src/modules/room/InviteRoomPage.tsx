import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { SolidFriends } from "../../icons";
import { isServer } from "../../lib/isServer";
import { ApiPreloadLink } from "../../shared-components/ApiPreloadLink";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { PageComponent } from "../../types/PageComponent";
import { Button } from "../../ui/Button";
import { CenterLoader } from "../../ui/CenterLoader";
import { InfoText } from "../../ui/InfoText";
import { Input } from "../../ui/Input";
import { RoomCard } from "../../ui/RoomCard";
import { SingleUser } from "../../ui/UserAvatar";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { MiddlePanel } from "../layouts/GridPanels";
import { useGetRoomByQueryParam } from "./useGetRoomByQueryParam";
import { HeaderController } from "../display/HeaderController";
import { FeedHeader } from "../../ui/FeedHeader";

interface InviteRoomPageProps {}

const InviteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [invited, setInvited] = useState(false);
  const { t } = useTypeSafeTranslation();
  return (
    <Button
      size="small"
      disabled={invited}
      onClick={() => {
        onClick();
        setInvited(true);
      }}
    >
      {invited
        ? t("components.inviteButton.invited")
        : t("components.inviteButton.inviteToRoom")}
    </Button>
  );
};

const Page = ({
  cursor,
  isLastPage,
  onLoadMore,
}: {
  cursor: number;
  isLastPage: boolean;
  isOnlyPage: boolean;
  onLoadMore: (o: number) => void;
}) => {
  const conn = useWrappedConn();
  const { t } = useTypeSafeTranslation();
  const { isLoading, data } = useTypeSafeQuery(
    ["getInviteList", cursor],
    {
      staleTime: Infinity,
      enabled: !isServer,
      refetchOnMount: "always",
    },
    [cursor]
  );

  if (isLoading) {
    return <CenterLoader />;
  }

  if (!data) {
    return null;
  }

  return (
    <>
      <HeaderController embed={{}} title="Invite" />
      {data.users.map((user) => (
        <div key={user.id} className="flex items-center mb-6">
          <div className="flex">
            <SingleUser size="md" src={user.avatarUrl} />
          </div>
          <div className="flex px-4 flex-1">
            <ApiPreloadLink route="profile" data={{ username: user.username }}>
              <div className="flex flex-col">
                <div className="flex text-primary-100">{user.displayName}</div>
                <div className="flex text-primary-200">@{user.username}</div>
              </div>
            </ApiPreloadLink>
          </div>
          <div className="block">
            <InviteButton
              onClick={() => {
                conn.mutation.inviteToRoom(user.id);
              }}
            />
          </div>
        </div>
      ))}
      {isLastPage && data.nextCursor ? (
        <div className={`flex justify-center py-5`}>
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

export const InviteRoomPage: PageComponent<InviteRoomPageProps> = ({}) => {
  const { data, isLoading } = useGetRoomByQueryParam();
  const { t } = useTypeSafeTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [cursors, setCursors] = useState([0]);

  if (isLoading || !data || "error" in data) {
    return (
      <DefaultDesktopLayout>
        <MiddlePanel>
          <CenterLoader />
        </MiddlePanel>
      </DefaultDesktopLayout>
    );
  }

  const { room } = data;
  const url = window.location.origin + `/room/${room.id}`;

  let buttonText = "copy";

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (navigator.share) {
    buttonText = "share link to room";
  } else if (copied) {
    buttonText = "copied";
  }

  return (
    <DefaultDesktopLayout>
      <MiddlePanel>
        <>
          {!navigator.share ? (
            <div className={`flex text-primary-100 font-bold text-2xl mb-2`}>
              {t("pages.inviteList.shareRoomLink")}
            </div>
          ) : null}
          <div data-testid="container" className={`mb-8 flex`}>
            <Input readOnly ref={inputRef} value={url} className="mr-2" />
            <Button
              size="small"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ url });
                } else {
                  inputRef.current?.select();
                  document.execCommand("copy");
                  setCopied(true);
                }
              }}
            >
              {buttonText}
            </Button>
          </div>
        </>
        {cursors.map((cursor, i) => (
          <Page
            key={cursor}
            cursor={cursor}
            isOnlyPage={cursors.length === 1}
            onLoadMore={(c) => setCursors([...cursors, c])}
            isLastPage={i === cursors.length - 1}
          />
        ))}
      </MiddlePanel>
    </DefaultDesktopLayout>
  );
};

InviteRoomPage.ws = true;
