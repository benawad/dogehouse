import React from "react";
import { Story } from "@storybook/react";
import { BaseDropdownSm, BaseDropdownSmItem } from "../ui/BaseDropdownSm";

export default {
  title: "BaseDropdownSm",
};

const BaseDropdownSmStory: Story = () => {
  return (
    <BaseDropdownSm>
      <BaseDropdownSmItem>Apple Calendar</BaseDropdownSmItem>
      <BaseDropdownSmItem>Google</BaseDropdownSmItem>
      <BaseDropdownSmItem>Outlook</BaseDropdownSmItem>
      <BaseDropdownSmItem>Outlook Web App</BaseDropdownSmItem>
      <BaseDropdownSmItem>Yahoo</BaseDropdownSmItem>
    </BaseDropdownSm>
  );
};

export const Main = BaseDropdownSmStory;
