import { Story } from "@storybook/react";
import React from "react";
import {
  FeaturedRoomCardAvatars,
  FeaturedRoomCardAvatarsProps,
} from "../../ui/mobile/FeaturedRoomCardAvatars";
import src from "../../img/avatar.png";

export default {
  title: "FeaturedRoomCardAvatars",
  component: FeaturedRoomCardAvatars,
};

const Avatars: Story<FeaturedRoomCardAvatarsProps> = () => {
  return <FeaturedRoomCardAvatars avatars={[src, src]} />;
};

const One: Story<FeaturedRoomCardAvatarsProps> = () => {
  return <FeaturedRoomCardAvatars avatars={[src]} />;
};

export const Main = Avatars.bind({});
export const OneAvatar = One.bind({});
