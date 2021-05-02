import React from "react";
import { Story } from "@storybook/react";
import { ErrorButtonItem, ErrorButtonItemProps } from "../ui/ErrorButtonItem";

export default {
  title: "ErrorButtonItem",
  component: ErrorButtonItem,
};

export const Main: Story<ErrorButtonItemProps> = ({
  actionButtonText = "Refresh",
  errorMessageHeading = "No microphone found",
  errorMessageText = "You either have no device plugged in or haven’t given this website permission",
}) => {
  return (
    <div className="mx-auto" style={{ width: 600 }}>
      <ErrorButtonItem
        actionButtonText={actionButtonText}
        errorMessageHeading={errorMessageHeading}
        errorMessageText={errorMessageText}
      />
    </div>
  );
};
