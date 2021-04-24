import * as React from "react";
import { Story } from "@storybook/react";
import { MobileNav, MobileNavProps } from "../ui/mobile/MobileNav";
import {
  SolidHome,
  SolidFriends,
  SolidCompass,
  SolidCalendar,
  SolidNew,
} from "../icons";

export default {
  title: "MobileNav",
  component: MobileNav,
};

const items = [
  {
    targetPath: "/home",
    icon: <SolidHome />,
  },
  {
    targetPath: "/home",
    icon: <SolidCalendar />,
  },
  {
    targetPath: "/home",
    icon: <SolidNew />,
  },
  {
    targetPath: "/home",
    icon: <SolidCompass />,
  },
  {
    targetPath: "/home",
    icon: <SolidFriends />,
  },
];

export const Main: Story<MobileNavProps> = ({ ...props }) => {
  return <MobileNav {...props} items={items} />;
};

Main.bind({});
