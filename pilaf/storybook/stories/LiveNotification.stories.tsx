import { storiesOf } from "@storybook/react-native";
import React from "react";
import CenterView from "./CenterView";
import { LiveNotification } from "../../src/components/notifications/LiveNotification";

const buttonStories = storiesOf("LiveNotification", module);

buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <LiveNotification username={"DrMadTurkey"} time={"now"} joined={true} />
));
