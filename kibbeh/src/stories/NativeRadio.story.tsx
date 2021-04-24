import React from "react";
import { Story } from "@storybook/react";

import { NativeRadio, NativeRadioProps } from "../ui/NativeRadio";

export default {
  title: "NativeRadio",
  component: NativeRadio,
};

export const Main: Story<NativeRadioProps> = ({ ...props }) => (
  <NativeRadio {...props} />
);

Main.bind({});
