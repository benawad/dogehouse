import React from "react";
import { Story } from "@storybook/react";
import { ErrorMessage, ErrorMessageProps } from "../ui/ErrorMessage";
import { toStr } from "./utils/toStr";
import { toBoolean } from "./utils/toBoolean";

export default {
  title: "ErrorMessage",
};

const TheErrorMessage: Story<ErrorMessageProps> = ({
  message,
  button,
  autoClose = false,
}) => {
  return (
    <ErrorMessage message={message} button={button} autoClose={autoClose} />
  );
};

export const Main = TheErrorMessage.bind({});

Main.args = {
  message: "Websocket got disconnected",
  button: "Refresh",
};

Main.argTypes = {
  message: toStr(),
  button: toStr(),
  autoClose: toBoolean(),
};
