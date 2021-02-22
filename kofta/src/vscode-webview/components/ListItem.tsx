import React from "react";
import { CheckIcon } from "../svgs/CheckIcon";

interface ListItemProps {}

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return (
    <li className={`flex my-2`}>
      <CheckIcon /><p className={`ml-3`}>{children}</p>
    </li>
  );
};
