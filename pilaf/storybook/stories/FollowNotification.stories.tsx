import { storiesOf } from "@storybook/react-native";
import React from "react";
import CenterView from "./CenterView";
import { FollowNotification } from "../../src/components/notifications/FollowNotification";
import { boolean, text } from "@storybook/addon-knobs";

const buttonStories = storiesOf("FollowNotification", module);

buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <FollowNotification
    username={text("UserName", "DrMadTurkey")}
    userAvatarSrc={require("../../src/assets/images/100.png")}
    time={"now"}
    isOnline={boolean("isOnline", false)}
    following={boolean("Following", false)}
  />
));
