import React from "react";
import { Check } from "react-feather";
import { tw } from "twind";

interface ListItemProps {}

export const ListItem: React.FC<ListItemProps> = ({ children }) => {
  return (
    <li className={tw`my-2`}>
      <span className={tw`inline-flex items-center`}>
        <Check className={tw`h-6 w-6`} />
        <p className={tw`ml-3`}>{children}</p>
      </span>
    </li>
  );
};
