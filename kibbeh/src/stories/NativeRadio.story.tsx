import React from "react";
import { Meta, Story } from "@storybook/react";
import {
  NativeRadio,
  NativeRadioController,
  NativeRadioControllerProps,
} from "../ui/NativeRadio";
import { SolidMoon } from "../icons";

const meta: Meta<NativeRadioControllerProps> = {
  title: "NativeRadio",
};

export default meta;

export const WithIcon: Story<NativeRadioControllerProps> = (args) => {
  return (
    <div style={{ width: 640 }} className="bg-primary-800 p-4">
      <NativeRadioController radios={args.radios} />
    </div>
  );
};

WithIcon.bind({});

const Circle: React.FC<{ color: string }> = ({ color }) => (
  <div className={`rounded-full bg-${color} w-2 h-2`}></div>
);

WithIcon.args = {
  radios: [
    {
      title: "Online",
      subtitle: "When you’re online, it will be visible to everyone",
      icon: <Circle color="accent" />,
    },
    {
      title: "Do not disturb",
      subtitle: "Let your followers know that you’re away",
      icon: <SolidMoon width="10" height="10" style={{ color: "#FFA928" }} />,
    },
    {
      title: "Offline",
      subtitle: "Wear Harry Potter’s invisibility cloak",
      icon: <Circle color="primary-300" />,
    },
  ],
};

export const WithoutIcon: Story<NativeRadioControllerProps> = (args) => {
  return (
    <div style={{ width: 640 }} className="bg-primary-800 p-4">
      <NativeRadioController radios={args.radios} />
    </div>
  );
};

WithoutIcon.bind({});

WithoutIcon.args = {
  radios: [
    {
      title: "Everyone",
      subtitle: "Allow any user to send you DMs",
    },
    {
      title: "People I Follow",
      subtitle: "Only users you follow will be able to DM you",
    },
    {
      title: "No One",
      subtitle: "Prevent any user from sending you a DM",
    },
  ],
};
