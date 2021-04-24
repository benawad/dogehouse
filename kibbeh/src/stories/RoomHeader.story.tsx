import { Story } from "@storybook/react";
import React from "react";
import { RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { RoomHeader } from "../ui/RoomHeader";

export default {
  title: "RoomHeader",
};

const TheRoomHeader: Story<RoomCardHeadingProps> = () => {
  return (
    <div className="flex flex-col space-y-5">
      <RoomHeader
        title="Why CI/CD is important when working with a team"
        description=""
        names={["Terry Owen"]}
      />
    </div>
  );
};

export const Main = TheRoomHeader.bind({});
