import React from "react";
import { Story } from "@storybook/react";
import { MinimizedRoomCard } from "../ui/MinimizedRoomCard";
import { SearchOverlayProps } from "../ui/Search/SearchOverlay";

export default {
  title: "MinimizedRoomCard",
  component: MinimizedRoomCard,
};

const room = {
  name:
    "Senior Dev / Manager @ GoDaddy (TS/React/GQL) - Ask me whatever you want",
  speakers: ["Terry Owen", "Grace Abraham"],
  url: "/room/1829324",
  roomStartedAt: new Date(2020, 3, 3),
  myself: {
    isSpeaker: true,
    isMuted: false,
    isdeafened: false,
    switchMuted: () => {
      // no-op
    },
    isDeafened: false,
    switchDeafened: () => {
      // no-op
    },
    leave: () => {
      // no-op
    },
  },
};

export const Main: Story<SearchOverlayProps> = ({ ...props }) => (
  <MinimizedRoomCard {...props} room={room} />
);
