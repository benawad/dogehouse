import React from "react";
import { Story } from "@storybook/react";
import {
  RoomCardParticipants,
  RoomCardParticipantsProps,
} from "../ui/RoomCardParticipants";
import { SolidTime } from "../icons";

export default {
  title: "RoomCardParticipants",
};

const TheRoomCardParticipants: Story<RoomCardParticipantsProps> = ({
  users,
}) => {
  return (
    <div className="flex" style={{ width: "200px" }}>
      <RoomCardParticipants
        users={
          users
            ? users
            : [
                {
                  name: "GoldyyDev",
                  picture:
                    "https://avatars.githubusercontent.com/u/55450464?v=4",
                },
                {
                  name: "ofsho",
                  picture:
                    "https://avatars.githubusercontent.com/u/60016719?v=4",
                },
              ]
        }
      />
    </div>
  );
};

export const Main = TheRoomCardParticipants.bind({});
