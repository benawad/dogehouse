import React from "react";

import { avatarSizeMap, onlineIndicatorStyleMap, SingleUser } from "./SingleUser";

export interface AvatarProps {
  srcArray: string[];
  size?: keyof typeof onlineIndicatorStyleMap;
}

export const MultipleUsers: React.FC<AvatarProps> = ({ srcArray, size = "xs" }) => {
  const pixelSize = avatarSizeMap[size]

  return (
    <div
      className="flex relative"
      style={{ width: `${srcArray.length * 7 + 18}px` }}
    >
      {srcArray.slice(0, 3).map((s, i) => (
        <span
          key={s + i}
          className="absolute box-content bg-primary-800 rounded-full border-primary-800 top-1/2 transform -translate-y-1/2"
          style={{
            left: i * (parseInt(pixelSize.substring(0, pixelSize.length - 2)) / 3),
            zIndex: -i,
            borderWidth: "2px",
            width: pixelSize,
            height: pixelSize,
          }}
        >
          <SingleUser src={s} size={size} />
        </span>
      ))}
    </div>
  );
};
