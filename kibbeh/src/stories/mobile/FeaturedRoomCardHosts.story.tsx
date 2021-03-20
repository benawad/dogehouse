import { Story } from "@storybook/react";
import React from "react";
import src from "../../img/avatar.png";
import { FeaturedRoomCardHosts, FeaturedRoomCardHostsProps } from "../../ui/mobile/FeaturedRoomCardHosts";

export default {
  title: 'FeaturedRoomCardHosts',
  component: FeaturedRoomCardHosts
};

const Avatars: Story<FeaturedRoomCardHostsProps> = () => {
  return (
    <FeaturedRoomCardHosts avatars={[src, src]} names={['Marcus Bloch', 'Don Velez']} />
  );
};

export const Main = Avatars.bind({});
