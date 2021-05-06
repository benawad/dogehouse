import React from "react";
import { Story } from "@storybook/react";

import {
  GlobalSearch,
  GlobalSearchProps,
  HistoryItem,
  SearchResultItem,
} from "../../ui/Search/GlobalSearch";

import avatar from "../../img/avatar.png";
import { Room, User } from "@dogehouse/kebab";

export default {
  title: "Search/GlobalSearch",
  component: GlobalSearch,
};

const history: HistoryItem[] = [
  { id: "1", term: "javascript" },
  { id: "2", term: "react graphql" },
  { id: "3", term: "español" },
  { id: "4", term: "elon musk interview" },
  { id: "5", term: "elon muk" },
];

const searchResults: SearchResultItem[] = [
  {
    id: "1",
    name: "The developer’s hangout",
    // hosts: ["Terry Owen", "Grace Abraham"],
    numPeopleInside: 355,
  } as Room,
  {
    id: "2",
    displayName: "The Real Anthony",
    username: "@anthonytheone",
    online: true,
    avatarUrl: avatar,
  } as User,
];

const globalSearchProps: GlobalSearchProps = {
  history,
  searchResults,
};

export const Main: Story<GlobalSearchProps> = ({ ...props }) => (
  <GlobalSearch
    history={props.history || globalSearchProps.history}
    searchResults={props.searchResults || searchResults}
  />
);

Main.bind({});
