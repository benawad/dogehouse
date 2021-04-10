import React from "react";
import { Story } from "@storybook/react";
import { RoomCardHeading, RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { SolidTime } from "../icons";

export default {
  title: "RoomCardHeading",
};

const LiveHeading: Story<RoomCardHeadingProps> = ({ icon, text }) => {
  return <RoomCardHeading text={text || "The developers hangout"} />;
};

const ScheduledHeading: Story<RoomCardHeadingProps> = ({ icon, text }) => {
  return (
    <RoomCardHeading
      icon={icon || <SolidTime />}
      text={text || "Live with u/DeepFuckingValue"}
    />
  );
};

export const Current = LiveHeading.bind({});
export const Scheduled = ScheduledHeading.bind({});
