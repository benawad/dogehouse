import { Room } from "@dogehouse/kebab";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { validate } from "uuid";
import { isServer } from "../../lib/isServer";
import { HeaderController } from "../display/HeaderController";

interface RoomOpenGraphPreviewProps {}

export const RoomOpenGraphPreview: React.FC<RoomOpenGraphPreviewProps> = ({
  children,
}) => {
  const { query } = useRouter();
  const id = typeof query.id === "string" ? query.id : "";
  const key = `/room/${id}`;
  const { data } = useQuery<{ room: Room } | { error: string }>(key, {
    enabled: isServer && validate(id),
  });

  if (isServer && data && "room" in data) {
    const { name, description } = data.room;
    return <HeaderController title={name} description={description} />;
  }

  return <>{children}</>;
};
