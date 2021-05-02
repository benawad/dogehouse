import { Room, User } from "@dogehouse/kebab";
import router from "next/router";
import React, { useState } from "react";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useScreenType } from "../../shared-hooks/useScreenType";
import { PageComponent } from "../../types/PageComponent";
import { PageHeader, SearchHeader } from "../../ui/mobile/MobileHeader";
import {
  RoomSearchResult,
  UserSearchResult,
} from "../../ui/Search/SearchResult";
import { WaitForWsAndAuth } from "../auth/WaitForWsAndAuth";
import { HeaderController } from "../display/HeaderController";
import { DefaultDesktopLayout } from "../layouts/DefaultDesktopLayout";
import { SearchBarController } from "./SearchBarController";

interface LoungePageProps {}

export const SearchPage: PageComponent<LoungePageProps> = ({}) => {
  const screenType = useScreenType();
  if (screenType !== "fullscreen") router.push("/dash");

  const [results, setResults] = useState({ items: [] } as {
    items: (User | Room)[];
  });
  const conn = useWrappedConn();

  return (
    <WaitForWsAndAuth>
      <HeaderController embed={{}} title="Search" />
      <DefaultDesktopLayout
        mobileHeader={
          <SearchHeader
            onSearchChange={(e) => {
              console.log(e.target.value);
              conn.query.search(e.target.value).then((r) => setResults(r));
            }}
            searchPlaceholder="Search"
            onBackClick={() => router.back()}
          />
        }
      >
        <div className="h-full w-full">
          {results &&
            results.items.map((el, i) => {
              if ("username" in el) {
                return (
                  <UserSearchResult
                    onClick={() => router.push(`/u/${el.username}`)}
                    key={i}
                    user={{
                      username: el.username,
                      displayName: el.displayName,
                      isOnline: el.online,
                      avatar: el.avatarUrl,
                    }}
                  />
                );
              } else {
                return (
                  <RoomSearchResult
                    onClick={() => router.push(`/room/${el.id}`)}
                    key={i}
                    room={{
                      displayName: el.name,
                      userCount: el.numPeopleInside,
                      hosts: el.peoplePreviewList,
                    }}
                  />
                );
              }
            })}
        </div>
      </DefaultDesktopLayout>
    </WaitForWsAndAuth>
  );
};

SearchPage.ws = true;
