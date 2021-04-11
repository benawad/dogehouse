// the boolean knob renders a switch which lets you toggle a value between true or false
// you call it like boolean("name here", default_value)
import { radios } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { MultipleUserAvatar } from "../../src/components/avatars/MultipleUserAvatar";
import CenterView from "./CenterView";

const buttonStories = storiesOf("MultipleUserAvatar", module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <MultipleUserAvatar
    srcArray={[
      require("../../src/assets/images/100.png"),
      require("../../src/assets/images/100.png"),
      require("../../src/assets/images/100.png"),
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
