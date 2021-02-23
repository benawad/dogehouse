import React from "react";
import { Check } from "react-feather";

interface ListItemProps {}

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return (
    <li className={`my-2`}>
      <span className={`inline-flex items-center`}>
        <Check className={`h-6 w-6`} />
        <p className={`ml-3`}>{children}</p>
      </span>
    </li>
  );
};
