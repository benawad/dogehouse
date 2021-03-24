import React from "react";
import { Story } from "@storybook/react";

import {
  UserSearchResult,
  UserSearchResultProps,
} from "../../../ui/Search/SearchResult";

export default {
  title: "Search/SearchResult/UserSearchResult",
  component: UserSearchResult,
};

import avatar from "../../../img/avatar.png";

const user = {
  avatar,
  displayName: "The Real Anthony",
  username: "@anthonytheone",
  isOnline: true,
};

export const Main: Story<UserSearchResultProps> = ({ ...props }) => (
  <UserSearchResult {...props} user={props.user || user} />
);

Main.bind({});
