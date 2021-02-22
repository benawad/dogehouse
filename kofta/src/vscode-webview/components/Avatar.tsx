import React, { useState } from "react";
import { tw } from "twind";

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
      width={size}
      height={size}
      style={{
        boxShadow: active
          ? "0 0 0 3px var(--vscode-textLink-foreground)"
          : undefined,
        ...style,
      }}
      className={circle ? tw`rounded-full` : tw`rounded-3xl`}
      src={
        error && usernameForErrorImg
          ? `https://ui-avatars.com/api/?name=${usernameForErrorImg}`
          : src
      }
    />
  );
};
