import React from "react";
import { Meta, Story } from "@storybook/react";

import { NativeRadioProps, NativeRadio, RadioOptions } from "../ui/NativeRadio";
import { OnlineIdication, SolidMoon } from "../icons";

const meta: Meta<NativeRadioProps> = {
  title: "NativeRadio",
  component: NativeRadio,
};

export default meta;

export const Main: Story<NativeRadioProps> = (args, { props }) => {
  return (
    <div>
      <NativeRadio {...args} {...props} />;
    </div>
  );
};

Main.bind({});

Main.args = {
  title: "sdkjsdkldjklj",
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
    },
    {
      icon: <SolidMoon fill="#FFA928" height={10} width={10} />,
      title: "Do not disturb",
      description: "Let your followers know that you’re away",
    },
    {
      icon: <SolidMoon fill="#FFA928" height={10} width={10} />,
      title: "Nightly (Dark)",
      description: "Caring about your eyes since 2021",
    },
    {
      title: "Diurnal (Light)",
      description: "Rethink your life decisions",
    },
  ],
};
