import React from "react";
import { Story } from "@storybook/react";
import { BoxedIcon } from "../ui/BoxedIcon";
// Icons
import { SmSolidMicrophone, SmSolidVolume, SmSolidFullscreen } from "../icons";

export default {
  title: "Boxed Icon",
};

const TheBoxedIcon: Story = () => {
  return (
    <div className="flex flex-row">
      <div className="m-1">
        <BoxedIcon>
          <SmSolidMicrophone />
        </BoxedIcon>
      </div>
      <div className="m-1">
        <BoxedIcon>
          <SmSolidVolume />
        </BoxedIcon>
      </div>
      <div className="m-1">
        <BoxedIcon>
          <SmSolidFullscreen />
        </BoxedIcon>
      </div>
    </div>
  );
};

export const Main = TheBoxedIcon.bind({});
