import React from "react";

import { SingleUser } from "./SingleUser";

export interface AvatarProps {
  srcArray: string[];
  className?: string;
}

export const MultipleUsers: React.FC<AvatarProps> = ({
  srcArray,
  className = "",
}) => {
  return (
    <div className={className}>
      {srcArray.slice(0, 3).map((s, i) => (
        <span
          key={s + i}
          className="rounded-full bg-primary-800 border-primary-800"
          style={{
            zIndex: srcArray.length - i,
            marginLeft: i > 0 ? -5 : 0,
            borderWidth: 1,
            height: 20,
            width: 20,
            overflow: "hidden",
          }}
        >
          <SingleUser src={s} size="xs" />
        </span>
      ))}
    </div>
  );
};
