import "../src/styles/globals.css";
import { addDecorator } from "@storybook/react";
import { init_i18n } from "../src/lib/i18n";

let hasInit = false;

addDecorator((storyFn) => {
  if (!hasInit) {
    init_i18n();
    hasInit = true;
  }
  return storyFn();
});

export const parameters = {
  backgrounds: {
    default: "bg-on-figma",
    values: [
      {
        name: "bg-on-figma",
        value: "#0b0e11",
      },
      {
        name: "black",
        value: "#000",
      },
    ],
  },
};
