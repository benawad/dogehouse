import React from "react";
import { Story } from "@storybook/react";

import {
  AccountOverlay,
  AccountOverlyProps,
} from "../ui/mobile/AccountOverlay";

export default {
  title: "AccountOverlay",
  component: AccountOverlay,
};

export const Main: Story<AccountOverlyProps> = (props) => {
  return (
    <div className="bg-primary-100 w-screen h-screen">
      <AccountOverlay></AccountOverlay>
    </div>
  );
};

Main.bind({});
