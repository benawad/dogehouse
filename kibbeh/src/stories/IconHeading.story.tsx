import React from "react";
import { Story } from "@storybook/react";
import { IconHeading, IconHeadingProps } from "../ui/IconHeading";
import { SmSolidTime } from "../icons";

export default {
  title: "IconHeading",
};

const TheIconHeading: Story<IconHeadingProps> = ({ icon, text }) => {
  return (
    <IconHeading
      icon={icon || <SmSolidTime />}
      text={text || "Live with u/DeepFuckingValue"}
    />
  );
};

export const Main = TheIconHeading.bind({});
