import React from "react";
import { tw } from "twind";
import { CheckIcon } from "../svgs/CheckIcon";

interface ListItemProps {}

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return (
    <li className={tw`flex my-2`}>
      <CheckIcon /><p className={tw`ml-3`}>{children}</p>
    </li>
  );
};
