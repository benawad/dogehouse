import React from "react";
import { Story } from "@storybook/react";
import {
  MessagesDropdown,
  MessagesDropdownProps,
} from "../ui/MessagesDropdown";
import avatar from "../img/avatar.png";

export default {
  title: "MessagesDropdown",
  component: MessagesDropdown,
};

export const ZeroMessages: Story<MessagesDropdownProps> = ({ ...props }) => {
  return <MessagesDropdown {...props} />;
};

ZeroMessages.bind({});

const user = {
  avatar,
  username: "TerryOwen",
  isOnline: true,
};

const msg = {
  text:
    "Hey! I really liked your room, but would like to contribute to dogehouse",
  ts: 1615116474,
};

const messageList = [
  { user, msg },
  { user, msg },
  { user, msg },
  { user, msg },
];

export const NewMessages: Story<MessagesDropdownProps> = () => {
  return <MessagesDropdown messageList={messageList} />;
};

NewMessages.bind({});
