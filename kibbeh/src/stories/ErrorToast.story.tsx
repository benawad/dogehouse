import React from "react";
import { Story } from "@storybook/react";
import { ErrorToast, ErrorMessageProps } from "../ui/Toast";
import { toStr } from "./utils/toStr";
import { toBoolean } from "./utils/toBoolean";

export default {
  title: "ErrorMessage",
};

const TheErrorMessage: Story<ErrorMessageProps> = ({ message, button }) => {
  return <ErrorToast message={message} button={button} onClose={() => {}} />;
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
