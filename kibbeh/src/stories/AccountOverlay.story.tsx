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

export const Main: Story<AccountOverlyProps> = ({
  children = "",
  className = "",
}) => (
  <div style={{ width: "414px", height: "362px" }}>
    <AccountOverlay className={className}>{children}</AccountOverlay>
  </div>
);

Main.bind({});
