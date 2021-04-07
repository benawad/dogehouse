// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck @todo this file needs to be fixed

import { Feed, FeedProps } from "../ui/Feed";
import { Story } from "@storybook/react";
import { GbFlagIcon as Icon } from "./utils/GbFlagIcon";
import { addHours } from "date-fns";

export default {
  title: "Feed",
  component: Feed,
};

export const Main: Story<FeedProps> = ({
  title = "Your feed",
  actionTitle = "New room",
  onActionClicked = () => null,
  rooms = [
    {
      title: "Live with u/DeepFuckingValue",
      subtitle: "Doug Terry, Denae Augustine, DeepFuckingValue",
      listeners: 14400,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#interview", "#GME"],
    },
    {
      title: "Bitcoin and You - The Future of Crypto",
      subtitle: "Satoshi Nakamoto",
      listeners: 14400,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#keynote", "#BTC", "#TOTHEMOON"],
    },
    {
      title: "Why CI & CD is important when working with a team",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: addHours(Date.now(), 9),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
    {
      title:
        "Senior Dev / Manager @ GoDaddy (TS/React/GQL) - Ask me whatever you want",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: addHours(Date.now(), 2),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
  ],
  emptyPlaceholder = <p>nothing to see here</p>,
}) => (
  <div style={{ width: 640 }}>
    <Feed
      title={title}
      actionTitle={actionTitle}
      onActionClicked={onActionClicked}
      rooms={rooms}
      emptyPlaceholder={emptyPlaceholder}
    />
  </div>
);

Main.bind({});

export const NothingLive: Story<FeedProps> = ({
  title = "Your feed",
  actionTitle = "New room",
  onActionClicked = () => null,
  rooms = [
    {
      title: "Live with u/DeepFuckingValue",
      subtitle: "Doug Terry, Denae Augustine, DeepFuckingValue",
      listeners: 14400,
      scheduledFor: addHours(Date.now(), 4),
      tags: [<Icon key={0} />, "#interview", "#GME"],
    },
    {
      title: "Bitcoin and You - The Future of Crypto",
      subtitle: "Satoshi Nakamoto",
      listeners: 14400,
      scheduledFor: addHours(Date.now(), 7),
      tags: [<Icon key={0} />, "#keynote", "#BTC", "#TOTHEMOON"],
    },
    {
      title: "Why CI & CD is important when working with a team",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: addHours(Date.now(), 2),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
    {
      title:
        "Senior Dev / Manager @ GoDaddy (TS/React/GQL) - Ask me whatever you want",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: addHours(Date.now(), 1),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
  ],
}) => (
  <div style={{ width: 640 }}>
    <Feed
      title={title}
      actionTitle={actionTitle}
      onActionClicked={onActionClicked}
      rooms={rooms}
      emptyPlaceholder="nothing here"
    />
  </div>
);

NothingLive.bind({});

export const NothingScheduled: Story<FeedProps> = ({
  title = "Your feed",
  actionTitle = "New room",
  onActionClicked = () => null,
  rooms = [
    {
      title: "Live with u/DeepFuckingValue",
      subtitle: "Doug Terry, Denae Augustine, DeepFuckingValue",
      listeners: 14400,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#interview", "#GME"],
    },
    {
      title: "Bitcoin and You - The Future of Crypto",
      subtitle: "Satoshi Nakamoto",
      listeners: 14400,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#keynote", "#BTC", "#TOTHEMOON"],
    },
    {
      title: "Why CI & CD is important when working with a team",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
    {
      title:
        "Senior Dev / Manager @ GoDaddy (TS/React/GQL) - Ask me whatever you want",
      subtitle: "Terry Owen, Grace Abraham, Richard Cameron",
      listeners: 0,
      scheduledFor: new Date(Date.now() - 100),
      tags: [<Icon key={0} />, "#tech", "#CI/CD", "webinar"],
    },
  ],
}) => (
  <div style={{ width: 640 }}>
    <Feed
      title={title}
      actionTitle={actionTitle}
      onActionClicked={onActionClicked}
      rooms={rooms}
      emptyPlaceholder="nothing here"
    />
  </div>
);

NothingScheduled.bind({});

export const Empty: Story<FeedProps> = ({
  title = "Your feed",
  actionTitle = "New room",
  onActionClicked = () => null,
  rooms = [],
  emptyPlaceholder = (
    <p className="text-primary-100 justify-center">(nothing to see here)</p>
  ),
}) => (
  <div style={{ width: 640 }}>
    <Feed
      title={title}
      actionTitle={actionTitle}
      onActionClicked={onActionClicked}
      rooms={rooms}
      emptyPlaceholder={emptyPlaceholder}
    />
  </div>
);

Empty.bind({});
