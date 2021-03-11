import React from "react";
import { Story } from "@storybook/react";
import { UserBadge } from "../ui/UserBadge";
import { SmSolidDogenitro } from "../icons";

export default {
  title: "UserBadge",
};

const TheUserBadge: Story = () => {
  return (
    <div className="flex flex-row">
      <div className="m-1">
        <UserBadge>ƉC</UserBadge>
      </div>
      <div className="m-1">
        <UserBadge>ƉS</UserBadge>
      </div>
      <div className="m-1">
        <UserBadge variant="secondary">
          <SmSolidDogenitro style={{ color: '#FFF' }} width={12} />
        </UserBadge>
      </div>
    </div>
  );
};

export const Main = TheUserBadge.bind({});
