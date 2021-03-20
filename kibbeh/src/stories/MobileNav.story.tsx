import * as React from "react";
import { Story } from "@storybook/react";
import { MobileNav, MobileNavProps } from "../ui/MobileNav";
import {
  SmSolidHome,
  SmSolidFriends,
  SmSolidCompass,
  SmSolidCalendar,
  SmSolidPlus,
} from "../icons";

export default {
  title: "MobileNav",
  component: MobileNav,
};

const items = [
  {
    targetPath: "/home",
    icon: <SmSolidHome />,
  },
  {
    targetPath: "/home",
    icon: <SmSolidCalendar />,
  },
  {
    targetPath: "/home",
    icon: <SmSolidPlus />,
  },
  {
    targetPath: "/home",
    icon: <SmSolidCompass />,
  },
  {
    targetPath: "/home",
    icon: <SmSolidFriends />,
  },
];

export const Main: Story<MobileNavProps> = ({ ...props }) => {
  return <MobileNav {...props} items={items} />;
};

Main.bind({});
