import React from "react";
import { Story } from "@storybook/react";

import {
  GlobalSearch,
  GlobalSearchProps,
  HistoryItem,
  SearchResultItem,
} from "../../ui/Search/GlobalSearch";

import avatar from "../../img/avatar.png";

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

const searchResult: SearchResultItem[] = [
  {
    type: "room",
    result: {
      id: "1",
      displayName: "The developer’s hangout",
      hosts: ["Terry Owen", "Grace Abraham"],
      userCount: 355,
    },
  },
  {
    type: "user",
    result: {
      id: "2",
      displayName: "The Real Anthony",
      username: "@anthonytheone",
      isOnline: true,
      avatar,
    },
  },
];

const globalSearchProps: GlobalSearchProps = {
  history,
  searchResult,
};

export const Main: Story<GlobalSearchProps> = ({ ...props }) => (
  <GlobalSearch
    history={props.history || globalSearchProps.history}
    searchResult={props.searchResult || searchResult}
  />
);

Main.bind({});
