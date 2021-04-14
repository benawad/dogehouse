import React from "react";

import { Story } from "@storybook/react";
import {
  PageHeader,
  PageHeaderProps,
} from "../../ui/mobile/MobileHeader/PageHeader";

export default {
  title: "MobileHeader/PageHeader",
  component: PageHeader,
};

const ThePageHeader: Story<PageHeaderProps> = ({
  title = "Loren ipsum",
  onBackClick = () => null,
}) => (
  <div className="flex" style={{ width: 420 }}>
    <PageHeader title={title} onBackClick={onBackClick} />
  </div>
);

export const Main = ThePageHeader.bind({});
