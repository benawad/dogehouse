import React from "react";

import { SingleUser } from "./SingleUser";

export interface AvatarProps {
  srcArray: string[];
}

export const MultipleUsers: React.FC<AvatarProps> = ({ srcArray }) => {
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
            left: i * 7,
            zIndex: -i,
            borderWidth: "2px",
            width: "20px",
            height: "20px",
          }}
        >
          <SingleUser src={s} size="xs" />
        </span>
      ))}
    </div>
  );
};
