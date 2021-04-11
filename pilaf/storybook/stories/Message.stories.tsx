import { storiesOf } from "@storybook/react-native";
import React from "react";
import { MessageElement } from "../../src/components/MessageElement";
import CenterView from "./CenterView";

const buttonStories = storiesOf("MessageElement", module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

const user = {
  avatar: require("../../src/assets/images/100.png"),
  username: "TerryOwen",
  isOnline: true,
};

const msg = {
  text:
    "Hey! I really liked your room, but would like to contribute to dogehouse",
  ts: 1615116474,
};

buttonStories.add("Main", () => <MessageElement user={user} msg={msg} />);
