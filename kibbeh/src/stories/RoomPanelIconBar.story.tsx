import { Story } from "@storybook/react";
import React from "react";
import { RoomPanelIconBar } from "../ui/RoomPanelIconBar";

export default {
  title: "RoomPanelIconBar",
};

export const Main: Story = () => {
  return (
    <RoomPanelIconBar
      onToggleChat={() => {}}
      onLeaveRoom={() => {}}
      onInvitePeopleToRoom={() => {}}
      mute={{ isMuted: false, onMute: () => {} }}
      deaf={{ isDeaf: false, onDeaf: () => {} }}
      onRoomSettings={() => {}}
    />
  );
};
