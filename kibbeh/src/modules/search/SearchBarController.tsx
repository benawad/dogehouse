import React, { useEffect, useState } from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { SearchBar } from "../../ui/Search/SearchBar";
import { SearchOverlay } from "../../ui/Search/SearchOverlay";
import Downshift from "downshift";
import { Room, User } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import { InfoText } from "../../ui/InfoText";
import {
  RoomSearchResult,
  UserSearchResult,
} from "../../ui/Search/SearchResult";
import { useMediaQuery } from "react-responsive";

interface SearchControllerProps {}

export const SearchBarController: React.FC<SearchControllerProps> = ({}) => {
  const [rawText, setText] = useState("");
  const [text] = useDebounce(rawText, 200);
  const { t } = useTypeSafeTranslation();
  const isOverflowing = useMediaQuery({ maxWidth: 475 });
  let enabled = false;
  const isUsernameSearch = text.startsWith("@");

  if (text && isUsernameSearch && text.trim().length > 2) {
    enabled = true;
  }
  if (text && !isUsernameSearch && text.trim().length > 1) {
    enabled = true;
  }

  const { data } = useTypeSafeQuery(
    ["search", text],
    {
      enabled,
    },
    [text]
  );
  const { push } = useRouter();

  return (
    <Downshift<Room | User>
      onChange={(selection) => {
        if (!selection) {
          return;
        }
        if ("username" in selection) {
          push(`/u/[username]`, `/u/${selection.username}`);
          return;
        }

        push(`/room/[id]`, `/room/${selection.id}`);
      }}
      onInputValueChange={(v) => {
        setText(v);
      }}
      itemToString={(item) => {
        if (!item) {
          return "";
        } else if ("username" in item) {
          return item.username;
        }
        return item.name;
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div className="relative w-full z-10 flex flex-col">
          <SearchBar
            {...getInputProps()}
            placeholder={
              isOverflowing
                ? t("components.search.placeholderShort")
                : t("components.search.placeholder")
            }
          />
          {isOpen ? (
            <SearchOverlay
              {...getRootProps({ refKey: "ref" }, { suppressRefError: true })}
            >
              <ul
                className="w-full px-2 mb-2 mt-7 bg-primary-800 rounded-b-8 overflow-y-auto"
                {...getMenuProps({ style: { top: 0 } })}
              >
                {data?.data.rooms.length === 0 &&
                data?.data.users.length === 0 ? (
                  <InfoText className="p-3">no results</InfoText>
                ) : null}
                {data?.data.rooms.map((item, index) => (
                  <li
                    key={item.id}
                    {...getItemProps({
                      index,
                      item,
                    })}
                  >
                    <RoomSearchResult
                      room={{
                        displayName: item.name,
                        hosts: item.peoplePreviewList,
                        userCount: item.numPeopleInside,
                      }}
                    />
                  </li>
                ))}
                {data?.data.users.map((item, index) => (
                  <li
                    key={item.id}
                    data-testid={`search:user:${item.username}`}
                    {...getItemProps({
                      index,
                      item,
                    })}
                  >
                    <UserSearchResult
                      user={{
                        username: item.username,
                        displayName: item.displayName,
                        isOnline: item.online,
                        avatar: item.avatarUrl,
                      }}
                      className={
                        highlightedIndex === index
                          ? "bg-primary-700"
                          : "bg-primary-800"
                      }
                    />
                  </li>
                ))}
              </ul>
            </SearchOverlay>
          ) : null}
        </div>
      )}
    </Downshift>
  );
};
