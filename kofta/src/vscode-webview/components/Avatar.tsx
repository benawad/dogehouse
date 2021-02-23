import React, { useState } from "react";

interface AvatarProps {
  src: string;
  size?: number;
  active?: boolean;
  circle?: boolean;
  usernameForErrorImg?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  size = 70,
  active,
  circle,
  usernameForErrorImg,
}) => {
  const [error, setError] = useState(false);
  return (
    <img
      alt="avatar"
      onError={() => setError(true)}
      width={size}
      height={size}
      style={active ? { boxShadow: "0 0 0 3px #60A5FA" } : undefined}
      className={circle ? `rounded-full` : `rounded-3xl`}
      src={
        error && usernameForErrorImg
          ? `https://ui-avatars.com/api/?name=${usernameForErrorImg}`
          : src
      }
    />
  );
};
