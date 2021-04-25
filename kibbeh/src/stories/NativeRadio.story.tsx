import React from "react";
import { Meta, Story } from "@storybook/react";
import {
  NativeRadioProps,
  NativeRadio,
  NativeRadioList,
} from "../ui/NativeRadio";
import { OnlineIdication, SolidMoon } from "../icons";

const meta: Meta<NativeRadioProps> = {
  title: "NativeRadio",
  component: NativeRadioList,
  subcomponents: { NativeRadioList },
  argTypes: {
    id: {
      control: {
        type: "inline-radio",
        options: ["online", "not-disturb", "dark-theme", "light-theme"],
      },
    },
  },
};

export default meta;

export const Main: Story<NativeRadioProps> = (args) => {
  return <NativeRadio {...args} />;
};

Main.bind({});

Main.args = {
  radios: [
    {
      icon: (
        <OnlineIdication
          strokeWidth={0}
          fill="#FD4D4D"
          height={10}
          width={10}
        />
      ),
      title: "Online",
      description: "When you’re online, it will be visible to everyone",
      id: "online",
      checked: false,
    },
    {
      icon: <SolidMoon fill="#FFA928" height={10} width={10} />,
      title: "Do not disturb",
      description: "Let your followers know that you’re away",
      id: "not-disturb",
      checked: false,
    },
    {
      title: "Nightly (Dark)",
      description: "Caring about your eyes since 2021",
      id: "dark-theme",
    },
    {
      title: "Diurnal (Light)",
      description: "Rethink your life decisions",
      id: "light-theme",
    },
  ],
};

export const Secondary: Story<NativeRadioProps> = (args) => {
  return <NativeRadioList {...args} />;
};

Secondary.args = {
  icon: <OnlineIdication key={1} id="online" />,
};

Secondary.argTypes = {
  icon: {
    controls: {
      type: "select",
    },
  },
};
