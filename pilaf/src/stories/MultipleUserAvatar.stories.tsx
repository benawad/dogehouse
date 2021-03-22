import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { MessageElement } from "../components/MessageElement";

// the boolean knob renders a switch which lets you toggle a value between true or false
// you call it like boolean("name here", default_value)
import { boolean, radios, withKnobs, text } from "@storybook/addon-knobs";
import { colors } from "../constants/dogeStyle";
import CenterView from "./CenterView";
import { MultipleUserAvatar } from "../components/avatars/MultipleUserAvatar";

const buttonStories = storiesOf("MultipleUserAvatar", module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

const user = {
  avatar: require("../assets/images/100.png"),
  username: "TerryOwen",
  isOnline: true,
};

buttonStories.add("Main", () => (
  <MultipleUserAvatar
    srcArray={[
      require("../assets/images/100.png"),
      require("../assets/images/100.png"),
      require("../assets/images/100.png"),
    ]}
    size={radios(
      "Size",
      {
        default: "default",
        sm: "sm",
        xs: "xs",
      },
      "default"
    )}
  />
));
