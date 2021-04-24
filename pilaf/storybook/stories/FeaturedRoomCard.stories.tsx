import { number, text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { ScrollView, Text } from "react-native";
import { FeaturedRoomCard } from "../../src/components/FeaturedRoomCard";
import { Tag } from "../../src/components/Tag";
import { smallBold } from "../../src/constants/dogeStyle";
import CenterView from "./CenterView";

const featuredRoomCardStories = storiesOf("FeaturedRoomCard", module);

featuredRoomCardStories.addDecorator((getStory) => (
  <CenterView>{getStory()}</CenterView>
));

featuredRoomCardStories.add("Main", () => (
  <ScrollView style={{ flex: 1, padding: 20 }}>
    <FeaturedRoomCard
      title={text("title", "Starting your dream business in times of Covid")}
      subtitle={text("subtitle", "Marcus Bloch, Don Velez")}
      listeners={number("listeners", 400)}
      avatarSrcs={[
        require("../../src/assets/images/100.png"),
        require("../../src/assets/images/100.png"),
        require("../../src/assets/images/100.png"),
      ]}
      tags={[
        <Tag style={{ marginRight: 10 }} key={"trending"} glow>
          <Text style={{ ...smallBold }}>🔥 Trending</Text>
        </Tag>,
        <Tag style={{ marginRight: 10 }} key={"business-1"}>
          <Text style={{ ...smallBold }}>#Trending</Text>
        </Tag>,
        <Tag style={{ marginRight: 10 }} key={"business-2"}>
          <Text style={{ ...smallBold }}>#Business</Text>
        </Tag>,
        <Tag style={{ marginRight: 10 }} key={"business-3"}>
          <Text style={{ ...smallBold }}>#Business</Text>
        </Tag>,
      ]}
    />
  </ScrollView>
));
