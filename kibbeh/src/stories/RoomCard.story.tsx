import React from "react";
import { Story } from "@storybook/react";
import { addDays, addHours, addSeconds } from "date-fns";

import { RoomCard, RoomCardProps } from "../ui/RoomCard";
import { GbFlagIcon as Icon } from "./utils/GbFlagIcon";

export default {
  title: "RoomCard",
  component: RoomCard,
};

export const Live: Story<RoomCardProps> = ({
  title = "Live with u/DeepFuckingValue",
  subtitle = "Doug Terry, Denae Augustine, DeepFuckingValue",
  listeners = 14400,
  scheduledFor = new Date(Date.now() - 100),
  tags = [<Icon key={0} />, "#interview", "#GME"],
}) => (
  <div className="flex" style={{ width: 640 }}>
    <RoomCard
      avatars={[]}
      title={title}
      subtitle={subtitle}
      listeners={listeners}
      scheduledFor={scheduledFor}
      tags={tags}
    />
  </div>
);

Live.bind({});

export const StartsIn2Secs: Story<RoomCardProps> = ({
  title = "Live with u/DeepFuckingValueLive with u/DeepFuckingValue Live with u/DeepFuckingValue Live with u/DeepFuckingValue Live with u/DeepFuckingValue",
  subtitle = "Doug Terry, Denae Augustine, DeepFuckingValue",
  listeners = 1300,
  scheduledFor = addSeconds(Date.now(), 2),
  tags = [<Icon key={0} />, "#interview", "#GME"],
}) => (
  <div className="flex" style={{ width: 640 }}>
    <RoomCard
      avatars={[]}
      title={title}
      subtitle={subtitle}
      listeners={listeners}
      scheduledFor={scheduledFor}
      tags={tags}
    />
  </div>
);

StartsIn2Secs.bind({});

export const StartsIn2Hours: Story<RoomCardProps> = ({
  title = "Why CI & CD is important when working with a team",
  subtitle = "Terry Owen, Grace Abraham, Richard Cameron",
  listeners = 0,
  scheduledFor = addHours(Date.now(), 2),
  tags = [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
}) => (
  <div className="flex" style={{ width: 640 }}>
    <RoomCard
      title={title}
      avatars={[]}
      subtitle={subtitle}
      listeners={listeners}
      scheduledFor={scheduledFor}
      tags={tags}
    />
  </div>
);

StartsIn2Hours.bind({});

export const StartsIn2Days: Story<RoomCardProps> = ({
  title = "Why CI & CD is important when working with a team",
  subtitle = "Terry Owen, Grace Abraham, Richard Cameron",
  listeners = 0,
  scheduledFor = addDays(Date.now(), 2),
  tags = [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
}) => (
  <div className="flex" style={{ width: 640 }}>
    <RoomCard
      avatars={[]}
      title={title}
      subtitle={subtitle}
      listeners={listeners}
      scheduledFor={scheduledFor}
      tags={tags}
    />
  </div>
);

StartsIn2Days.bind({});
