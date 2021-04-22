import React from "react";
import { Meta, Story } from "@storybook/react";
import { VolumeIndicator, VolumeIndicatorProps } from "../ui/VolumeIndicator";

const Template: Story<VolumeIndicatorProps> = ({ volume, bars }) => (
  <VolumeIndicator volume={volume} bars={bars}></VolumeIndicator>
);

export default {
  title: "VolumeIndicator",
  component: VolumeIndicator,
  args: {
    volume: 50,
    bars: 24,
  },
} as Meta;

export const Primary = Template.bind({});
