import React from "react";
import { Story } from "@storybook/react";
import { RoomCardHeading, RoomCardHeadingProps } from "../ui/RoomCardHeading";
import { SolidTime } from "../icons";
import { RoomAvatar } from "../ui/RoomAvatar";
import src from "../img/avatar.png";
import RegularDoge from "../img/regular-doge.png";

export default {
  title: "RoomAvatar",
};

export const Regular: Story<RoomCardHeadingProps> = () => {
  return <RoomAvatar src={src} username="Terry" />;
};

export const LongName: Story<RoomCardHeadingProps> = () => {
  return <RoomAvatar src={src} username="TerryTerryTerry" />;
};

export const ActiveSpeaker: Story<RoomCardHeadingProps> = () => {
  return <RoomAvatar src={src} username="Terry" activeSpeaker />;
};

export const Mod: Story<RoomCardHeadingProps> = () => {
  return (
    <RoomAvatar
      src={src}
      username="Terry"
      flair={
        <img
          src={RegularDoge}
          alt="room mod"
          style={{ marginLeft: 4, marginTop: 2 }}
          className={`w-3 h-3 ml-1`}
        />
      }
    />
  );
};

export const Muted: Story<RoomCardHeadingProps> = () => {
  return <RoomAvatar src={src} username="Terry" muted />;
};

export const Deafened: Story<RoomCardHeadingProps> = () => {
  return <RoomAvatar src={src} username="Terry" deafened />;
};
