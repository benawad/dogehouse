import { Room } from "@dogehouse/kebab";
import React from "react";
import { isServer } from "../../lib/isServer";
import { HeaderController } from "../display/HeaderController";

interface RoomOpenGraphPreviewProps {
  room: Room | null | undefined;
}

export const RoomOpenGraphPreview: React.FC<RoomOpenGraphPreviewProps> = ({
  room,
  children,
}) => {
  if (isServer && room) {
    const { name, description } = room;
    return (
      <HeaderController title={name} description={description} embed={{}} />
    );
  }

  return <>{children}</>;
};
