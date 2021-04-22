import { Story } from "@storybook/react";
import React from "react";
import { RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { RoomSectionHeader } from "../ui/RoomSectionHeader";

export default {
  title: "RoomSectionHeader",
};

const TheRoomSectionHeader: Story<RoomCardHeadingProps> = () => {
  return (
    <div className="flex flex-col space-y-5">
      <RoomSectionHeader tagText="17" title="Speakers" />
    </div>
  );
};

export const Main = TheRoomSectionHeader.bind({});
