import React from "react";
import { Story } from "@storybook/react";

import { MessageElement, MessageElementProps } from "../ui/MessageElement";

export default {
  title: "MessageElement",
  component: MessageElement,
};

import avatar from "../img/avatar.png";

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

export const Main: Story<MessageElementProps> = ({ ...props }) => {
  return (
    <MessageElement
      {...props}
      user={props.user || user}
      msg={props.msg || msg}
    />
  );
};

Main.bind({});
