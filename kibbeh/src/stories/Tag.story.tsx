import React from "react";
import { Story } from "@storybook/react";
import { Tag } from "../ui/Tag";
import { toStr } from "./utils/toStr";
import { GbFlagIcon as Icon } from "./utils/GbFlagIcon";

export default {
  title: "Tag",
  argTypes: {
    onChange: { action: "changed" },
  },
};

const TheTag: Story = ({ tag = "interview" }) => {
  return (
    <>
      <Tag>{tag}</Tag>
      <Tag>
        <Icon />
      </Tag>
    </>
  );
};

export const Main = TheTag.bind({});

Main.argTypes = {
  tag: toStr(),
};
