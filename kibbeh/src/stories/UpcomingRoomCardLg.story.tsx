import React from "react";
import { Story } from "@storybook/react";
import avatar from "./img/user-avatar-sm.png";
import avatar1 from "./img/user-avatar-sm1.png";

import {
  UpcomingRoomCardLg,
  UpcomingRoomCardLgProps,
} from "../ui/UpcomingRoomCardLg";

export default {
  title: "UpcomingRoomCardLg",
  component: UpcomingRoomCardLg,
};

UpcomingRoomCardLg.defaultProps = {
  title:
    "Japanese vs European cars (w/ ChrisFix) and with a very very vary very long text ",
  hosts: [
    {
      avatarUrl: avatar,
      bio: "",
      id: "1",
      displayName: "Glen Brenner",
      lastOnline: "",
      numFollowers: 0,
      numFollowing: 0,
      bannerUrl: "",
      online: true,
      username: "gle1",
      staff: false,
      contributions: 0,
    },
    {
      bannerUrl: "",
      avatarUrl: avatar1,
      bio: "",
      id: "2",
      displayName: "ChrisFix",
      lastOnline: "",
      numFollowers: 0,
      numFollowing: 0,
      online: true,
      username: "chr1",
      staff: false,
      contributions: 0,
    },
  ],
  date: 1616187600000,
  descriptions:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor risus lectus blandit posuere mauris feugiat gravida. Risus morbi commodo mattis molestie adipiscing tortor, mattis porta ullamcorper. Lorem orci convallis egestas commodo mauris, dui vestibulum, semper faucibus. Est quam lobortis proin non neque.",
  tags: [
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
    "#cars",
    "#debate",
  ],
};

export const Main: Story<UpcomingRoomCardLgProps> = ({ ...props }) => (
  <div style={{ width: "640px" }}>
    <UpcomingRoomCardLg {...props} />
  </div>
);
