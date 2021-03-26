import { storiesOf } from "@storybook/react-native";
import React from "react";
import { Text } from "react-native";
import CenterView from "./CenterView";
import { GenericNotification } from "../../src/components/notifications/GenericNotification";
import { paragraph } from "../../src/constants/dogeStyle";

const buttonStories = storiesOf("GenericNotification", module);

buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <GenericNotification
    notificationMsg={
      <Text style={{ ...paragraph }} numberOfLines={1}>
        General notification message a bit to long if you don't mind
      </Text>
    }
    time={"now"}
  />
));
