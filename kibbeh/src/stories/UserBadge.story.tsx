import React from "react";
import { Story } from "@storybook/react";
import { UserBadge } from "../ui/UserBadge";
import { SolidDogenitro } from "../icons";

export default {
  title: "UserBadge",
};

const TheUserBadge: Story = () => {
  return (
    <div className="flex flex-row">
      <div className="flex">
        <UserBadge>ƉC</UserBadge>
      </div>
      <div className="flex">
        <UserBadge>ƉS</UserBadge>
      </div>
      <div className="flex">
        <UserBadge variant="secondary">
          <SolidDogenitro style={{ color: "#FFF" }} width={12} />
        </UserBadge>
      </div>
    </div>
  );
};

export const Main = TheUserBadge.bind({});
