import React from "react";
import { Meta, Story } from "@storybook/react";
import {
  NativeCheckBox,
  NativeCheckboxProps,
  ToggleProps,
} from "../ui/NativeCheckbox";

const Template: Story<NativeCheckboxProps> = ({ ...props }) => (
  <NativeCheckBox {...props} />
);

export default {
  title: "NativeCheckbox",
  component: NativeCheckBox,
} as Meta;

export const Main = Template.bind({});
