import React from "react";
import { getUserAvatarUrl } from "../utils/getUserAvatarUrl";

interface AvatarProps {
  src: string;
  size?: number;
  active?: boolean;
  circle?: boolean;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  size = 70,
  active,
  circle,
  style,
}) => {
  const sizeSrc = getUserAvatarUrl(src, size);

  return (
    <img
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: circle ? "50%" : "30%",
        boxShadow: active
          ? "0 0 0 3px var(--vscode-textLink-foreground)"
          : undefined,
        ...style,
      }}
      src={sizeSrc}
    />
  );
};
