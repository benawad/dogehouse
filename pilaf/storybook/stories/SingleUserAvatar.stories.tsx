// the boolean knob renders a switch which lets you toggle a value between true or false
// you call it like boolean("name here", default_value)
import { boolean, radios } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { SingleUserAvatar } from "../../src/components/avatars/SingleUserAvatar";
import CenterView from "./CenterView";

const buttonStories = storiesOf("SingleUserAvatar", module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <SingleUserAvatar
    isOnline={boolean("is online", false)}
    src={require("../../src/assets/images/100.png")}
    size={radios(
      "Size",
      {
        default: "default",
        sm: "sm",
        m: "md",
        xxs: "xxs",
        xs: "xs",
      },
      "default"
    )}
  />
));
