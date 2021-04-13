import React from "react";

import { Story } from "@storybook/react";
import {
  ScheduledRoomSummaryCard,
  ScheduledRoomSummaryCardProps,
  UpcomingRoomsCard,
  UpcomingRoomsCardProps,
} from "../ui/UpcomingRoomsCard";

import src from "../img/avatar.png";
import { addDays } from "date-fns";

const today = new Date();

const upcomingRooms: ScheduledRoomSummaryCardProps[] = [
  {
    onClick: () => {},
    id: "1",
    scheduledFor: today,
    speakersInfo: {
      avatars: [src],
      speakers: ["Dough Terry"],
    },
    title: "Live with u/DeepFuckingValue",
  },
  {
    onClick: () => {},
    id: "2",
    scheduledFor: addDays(today, 1),
    speakersInfo: {
      avatars: [src, src],
      speakers: ["Daniel Gailey", "Bennie Beyers"],
    },
    title: "Is Apple equipment worth it?",
  },
  {
    onClick: () => {},
    id: "3",
    scheduledFor: addDays(today, 2),
    speakersInfo: {
      avatars: [src, src, src],
      speakers: ["Jessika Beyer", "Jefferey Bosco", "Hang Ness"],
    },
    title:
      "Starting your dream business in times of Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut ultricies turpis, vitae consectetur quam. Suspendisse venenatis justo justo, in pulvinar urna facilisis ut.",
  },
];

export default {
  title: "UpcomingRoomsCard",
  component: UpcomingRoomsCard,
};

export const ScheduledRoom: Story<ScheduledRoomSummaryCardProps> = ({
  ...props
}) => (
  <div className="flex" style={{ width: 365 }}>
    <ScheduledRoomSummaryCard {...props} {...upcomingRooms[2]} />
  </div>
);

ScheduledRoom.bind({});

export const Main: Story<UpcomingRoomsCardProps> = ({ ...props }) => (
  <div className="flex" style={{ width: 365 }}>
    <UpcomingRoomsCard {...props} rooms={upcomingRooms} />
  </div>
);

Main.bind({});
