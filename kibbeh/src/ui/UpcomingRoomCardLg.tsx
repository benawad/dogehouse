import React, { useState, useRef } from "react";
import { BaseUser } from "@dogehouse/kebab";
import { format } from "date-fns";

import { Tag } from "./Tag";
import { Button } from "./Button";
import { MultipleUsers } from "./UserAvatar";
import { BaseDropdownSm, BaseDropdownSmItem } from "./BaseDropdownSm";
import {
  LinkIcon,
  ShareIcon,
  TwitterIcon,
  SolidCalendar,
  SolidInstagram,
} from "../icons";
import { useOnClickOutside } from "../shared-hooks/useOnClickOutside";

export interface UpcomingRoomCardLgProps {
  title: string;
  date: number;
  tags: string[];
  hosts: BaseUser[];
  descriptions: string;
}

interface DropdownProps {}

const calenderDropdownItems = [
  { key: 0, value: "Apple Calender" },
  { key: 1, value: "Google" },
  { key: 2, value: "Outlook" },
  { key: 3, value: "Outlook Web App" },
  { key: 4, value: "Yahoo" },
];

const shareDropdownItems = [
  { key: 0, value: "Copy link", icon: LinkIcon },
  { key: 1, value: "Twitter", icon: TwitterIcon },
  { key: 2, value: "Instagram Post", icon: SolidInstagram },
  { key: 3, value: "Instagram Stroy", icon: SolidInstagram },
];

const CalenderDropDown: React.FC<DropdownProps> = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const clickHandler = (value: number) => {
    setOpen(false);
    console.log(value);
  };

  return (
    <div ref={ref} className="relative">
      <Button
        size="small"
        color="secondary"
        className="mr-2 whitespace-nowrap"
        onClick={() => setOpen((v) => !v)}
      >
        <span style={{ marginRight: "8px" }}>
          <SolidCalendar />
        </span>
        Add to calendar
      </Button>
      {open && (
        <span className="absolute top-5 left-0">
          <BaseDropdownSm>
            {calenderDropdownItems.map(({ key, value }, i) => (
              <BaseDropdownSmItem
                key={i}
                className="whitespace-nowrap"
                onClick={() => clickHandler(key)}
              >
                {value}
              </BaseDropdownSmItem>
            ))}
          </BaseDropdownSm>
        </span>
      )}
    </div>
  );
};

const ShareDropDown: React.FC<DropdownProps> = () => {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const clickHandler = (value: number) => {
    setOpen(false);
    console.log(value);
  };

  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <Button size="small" color="secondary" onClick={() => setOpen((v) => !v)}>
        <ShareIcon />
      </Button>
      {open && (
        <span className="absolute top-5 right-0">
          <BaseDropdownSm>
            {shareDropdownItems.map(({ key, value, icon: Icon }, i) => (
              <BaseDropdownSmItem
                key={i}
                className="flex items-center whitespace-nowrap"
                onClick={() => clickHandler(key)}
              >
                <span className="mr-2">
                  <Icon />
                </span>
                {value}
              </BaseDropdownSmItem>
            ))}
          </BaseDropdownSm>
        </span>
      )}
    </div>
  );
};

export const UpcomingRoomCardLg: React.FC<UpcomingRoomCardLgProps> = ({
  title,
  hosts,
  date,
  tags,
  descriptions,
}) => {
  const visibleHosts = hosts.slice(0, 3);

  return (
    <div className="p-4 bg-primary-800 rounded-8">
      <div className="flex justify-between mb-4">
        <h6 className="text-primary-100 font-bold overflow-ellipsis overflow-hidden whitespace-nowrap mr-5">
          {title}
        </h6>
        <div className="flex">
          <CalenderDropDown />
          <ShareDropDown />
        </div>
      </div>
      <div className="flex mb-4">
        <MultipleUsers srcArray={visibleHosts.map((h) => h.avatarUrl)} />
        <div className="text-primary-300 ml-2 overflow-ellipsis overflow-hidden whitespace-nowrap">
          {visibleHosts.map((h) => h.displayName).join(", ")}
        </div>
      </div>
      <div>
        <span className="text-accent">
          {format(+date, "MM/dd/yyyy hh:mma")}
        </span>
        <span className="text-primary-300 font-medium"> | {descriptions}</span>
      </div>
      {tags.length && (
        <div className="flex flex-wrap mt-2">
          {tags.map((t, index) => (
            <Tag key={index} className="mr-1 mt-2">
              {t}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};
