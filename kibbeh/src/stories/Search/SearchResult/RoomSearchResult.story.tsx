import React from "react";
import { Story } from "@storybook/react";

import {
  RoomSearchResult,
  RoomSearchResultProps,
} from "../../../ui/Search/SearchResult";

export default {
  title: "Search/SearchResult/RoomSearchResult",
  component: RoomSearchResult,
};

const room = {
  displayName: "The developer’s hangout",
  userCount: 355,
  hosts: ["Terry Owen", "Grace Abraham"],
};

export const Main: Story<RoomSearchResultProps> = ({ ...props }) => (
  <RoomSearchResult {...props} room={props.room || room} />
);

Main.bind({});
