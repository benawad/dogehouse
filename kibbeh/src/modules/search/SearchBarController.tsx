import React, { useState } from "react";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { SearchBar } from "../../ui/Search/SearchBar";
import { SearchOverlay } from "../../ui/Search/SearchOverlay";
import Downshift from "downshift";
import { Room, User } from "@dogehouse/kebab";
import { SingleUser } from "../../ui/UserAvatar";
import { useRouter } from "next/router";
import { BubbleText } from "../../ui/BubbleText";
import { formatNumber } from "../../ui/RoomCard";
import { useDebounce } from "use-debounce";
import { InfoText } from "../../ui/InfoText";

interface SearchControllerProps {}

export const SearchBarController: React.FC<SearchControllerProps> = ({}) => {
  const [rawText, setText] = useState("");
  const [text] = useDebounce(rawText, 200);
  const { t } = useTypeSafeTranslation();
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
        <div className="relative w-full z-10">
        <SearchBar
          {...getInputProps()}
          placeholder={t("components.search.placeholder")}
        />
        <SearchOverlay
          {...getRootProps({ refKey: "ref" }, { suppressRefError: true })}
          className={isOpen ? "visible" : "invisible"}
        >
          <ul
            className="absolute w-full bg-primary-800 rounded-b-8 overflow-y-auto"
            {...getMenuProps({ style: { top: 42, maxHeight: "50vh" } })}
          >
            {isOpen && data?.items.length === 0 ? (
              <InfoText className="p-3">no results</InfoText>
            ) : null}
            {isOpen
              ? data?.items.map((item, index) =>
                  "username" in item ? (
                    // eslint-disable-next-line react/jsx-key
                    <li
                      className={`flex p-3 ${
                        highlightedIndex === index
                          ? "bg-primary-700"
                          : "bg-primary-800"
                      } ${data.items.length - 1 === index ? "rounded-b-8" : ""}
                      `}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <SingleUser src={item.avatarUrl} size="md" />
                      <div className="ml-2">
                        <div className="text-primary-100">
                          {item.displayName}
                        </div>
                        <div className="text-primary-300">@{item.username}</div>
                      </div>
                    </li>
                  ) : (
                    // eslint-disable-next-line react/jsx-key
                    <li
                      className={`flex p-3 ${
                        highlightedIndex === index
                          ? "bg-primary-700"
                          : "bg-primary-800"
                      } ${data.items.length - 1 === index ? "rounded-b-8" : ""}
                      `}
                      {...getItemProps({
                        key: item.id,
                        index,
                        item,
                      })}
                    >
                      <div className="mr-auto">
                        <div className="text-primary-100">{item.name}</div>
                        <div className="text-primary-300">
                          {item.peoplePreviewList
                            .slice(0, 3)
                            .map((x) => x.displayName)
                            .join(", ")}
                        </div>
                      </div>
                      <div>
                        <BubbleText live>
                          {formatNumber(item.numPeopleInside)}
                        </BubbleText>
                      </div>
                    </li>
                  )
                )
              : null}
          </ul>
        </SearchOverlay>
        </div>
      )}
    </Downshift>
  );
};
