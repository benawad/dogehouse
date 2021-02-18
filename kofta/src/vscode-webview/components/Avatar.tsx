import React, { useState } from "react";

interface AvatarProps {
  src: string;
  size?: number;
  active?: boolean;
  circle?: boolean;
  style?: React.CSSProperties;
  usernameForErrorImg?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  size = 70,
  active,
  circle,
  style,
  usernameForErrorImg,
}) => {
  const [error, setError] = useState(false);
  return (
    <img
      alt="avatar"
      onError={() => setError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: circle ? "50%" : "30%",
        boxShadow: active
          ? "0 0 0 3px var(--vscode-textLink-foreground)"
          : undefined,
        ...style,
      }}
      src={
        error && usernameForErrorImg
          ? `https://ui-avatars.com/api/?name=${usernameForErrorImg}`
          : src
      }
    />
  );
};
