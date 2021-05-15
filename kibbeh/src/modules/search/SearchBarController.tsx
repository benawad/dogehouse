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
import usePageVisibility from "../../shared-hooks/usePageVisibility";

interface SearchControllerProps {}

export const SearchBarController: React.FC<SearchControllerProps> = ({}) => {
  const [rawText, setText] = useState("");
  const visible = usePageVisibility();
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

  const { data, isLoading } = useTypeSafeQuery(
    ["search", text],
    {
      enabled,
    },
    [text]
  );
  const { push } = useRouter();
  const results = data ? [...data.rooms, ...data.users] : [];

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
        if (visible) {
          setText(v);
        }
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
            value={rawText}
            placeholder={
              isOverflowing
                ? t("components.search.placeholderShort")
                : t("components.search.placeholder")
            }
            isLoading={isLoading}
          />
          {isOpen ? (
            <SearchOverlay
              {...getRootProps({ refKey: "ref" }, { suppressRefError: true })}
            >
              <ul
                className="w-full px-2 mb-2 mt-7 bg-primary-800 rounded-b-8 overflow-y-auto"
                {...getMenuProps({ style: { top: 0 } })}
              >
                {(data?.rooms.length === 0 && data?.users.length === 0) ||
                !data ? (
                  <InfoText className="p-3">no results</InfoText>
                ) : null}

                {results.map((item, index) =>
                  "username" in item ? (
                    // eslint-disable-next-line react/jsx-key
                    <li
                      data-testid={`search:user:${item.username}`}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <UserSearchResult
                        user={item}
                        className={
                          highlightedIndex === index
                            ? "bg-primary-700"
                            : "bg-primary-800"
                        }
                      />
                    </li>
                  ) : (
                    <li
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <RoomSearchResult
                        room={item}
                        className={
                          highlightedIndex === index
                            ? "bg-primary-700"
                            : "bg-primary-800"
                        }
                      />
                    </li>
                  )
                )}
              </ul>
            </SearchOverlay>
          ) : null}
        </div>
      )}
    </Downshift>
  );
};
