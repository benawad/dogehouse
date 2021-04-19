// the boolean knob renders a switch which lets you toggle a value between true or false
// you call it like boolean("name here", default_value)
import { boolean, radios, text } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { Button } from "../../src/components/buttons/Button";
import { colors } from "../../src/constants/dogeStyle";
import CenterView from "./CenterView";

const buttonStories = storiesOf("Button", module);

// lets storybook know to show the knobs addon for this story
buttonStories.addDecorator((getStory) => <CenterView>{getStory()}</CenterView>);

buttonStories.add("Main", () => (
  <View
    style={{
      display: "flex",
      flex: 1,
      justifyContent: "center",
      backgroundColor: colors.primary900,
    }}
  >
    <Button
      iconSrc={
        boolean("Example icon", false)
          ? require("../../src/assets/images/dogecoin.png")
          : undefined
      }
      title={text("Title", "New Room")}
      disabled={boolean("Disabled", false)}
      loading={boolean("Loading", false)}
      color={radios(
        "Color",
        {
          primary: "primary",
          secondary: "secondary",
        },
        "primary"
      )}
      size={radios(
        "Size",
        {
          big: "big",
          small: "small",
        },
        "small"
      )}
    />
  </View>
));
