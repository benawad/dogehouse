import { Story } from "@storybook/react";
import React from "react";
import src from "../../img/avatar.png";
import {
  FeaturedRoomCardHosts,
  FeaturedRoomCardHostsProps,
} from "../../ui/mobile/FeaturedRoomCardHosts";

export default {
  title: "FeaturedRoomCardHosts",
  component: FeaturedRoomCardHosts,
};

const Hosts: Story<FeaturedRoomCardHostsProps> = () => {
  return (
    <FeaturedRoomCardHosts
      avatars={[src, src]}
      names={["Marcus Bloch", "Don Velez"]}
    />
  );
};

const One: Story<FeaturedRoomCardHostsProps> = () => {
  return <FeaturedRoomCardHosts avatars={[src]} names={["Marcus Bloch"]} />;
};

export const Main = Hosts.bind({});
export const OneHost = One.bind({});
