import React from "react";
import { MultipleUsers, SingleUser } from "../UserAvatar";

export type FeaturedRoomCardAvatarsProps = {
  avatars: string[];
};

export const FeaturedRoomCardAvatars: React.FC<FeaturedRoomCardAvatarsProps> = ({
  avatars,
}) => {
  return (
    <div className="flex z-0">
      {avatars.slice(0, 2).map((s, i) => (
        <span
          key={s + i}
          className="rounded-full bg-primary-800 border-primary-800"
          style={{
            zIndex: avatars.length - i,
            marginLeft: i > 0 ? -10 : 0,
            borderWidth: 2,
            height: 50,
            width: 50,
            overflow: "hidden",
          }}
        >
          <SingleUser src={s} size="md" />
        </span>
      ))}
    </div>
  );
};
