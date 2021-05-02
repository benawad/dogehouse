import React from "react";
import { Story } from "@storybook/react";
import { BoxedIcon } from "../ui/BoxedIcon";
import { SolidMicrophone, SolidVolume, SolidFullscreen } from "../icons";

export default {
  title: "Boxed Icon",
};

const TheBoxedIcon: Story = () => {
  return (
    <div className="flex flex-row">
      <div className="flex m-1">
        <BoxedIcon>
          <SolidMicrophone />
        </BoxedIcon>
      </div>
      <div className="flex m-1">
        <BoxedIcon>
          <SolidVolume />
        </BoxedIcon>
      </div>
      <div className="flex m-1">
        <BoxedIcon>
          <SolidFullscreen />
        </BoxedIcon>
      </div>
    </div>
  );
};

export const Main = TheBoxedIcon.bind({});
