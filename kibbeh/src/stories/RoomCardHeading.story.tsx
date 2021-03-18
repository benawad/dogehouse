import React from "react";
import { Story } from "@storybook/react";
import { RoomCardHeading, RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { SmSolidTime } from "../icons";

export default {
  title: "RoomCardHeading",
};

const TheRoomCardHeading: Story<RoomCardHeadingProps> = ({ icon, text }) => {
  return (
    <div className="flex flex-col space-y-5">
      <RoomCardHeading
        icon={icon || <SmSolidTime />}
        text={text || "Live with u/DeepFuckingValue"}
      />

      <RoomCardHeading text={text || "The developers hangout"} />
    </div>
  );
};

export const Main = TheRoomCardHeading.bind({});
