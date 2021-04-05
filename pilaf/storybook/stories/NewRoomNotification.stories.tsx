import { storiesOf } from "@storybook/react-native";
import React from "react";
import CenterView from "./CenterView";
import { NewRoomNotification } from "../../src/components/notifications/NewRoomNotification";

const buttonStories = storiesOf("NewRoomNotification", module);

buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <NewRoomNotification username={"DrMadTurkey"} time={"now"} joined={true} />
));
