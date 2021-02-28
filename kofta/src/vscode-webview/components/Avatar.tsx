import React, { useState } from "react";

interface AvatarProps {
  src: string;
  size?: number;
  active?: boolean;
  circle?: boolean;
  usernameForErrorImg?: string;
  className?: string;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  size = 70,
  active,
  circle,
  usernameForErrorImg,
  className,
  isOnline,
}) => {
  const [error, setError] = useState(false);
  return (
    <div className="relative inline-block">
      <img
        alt="avatar"
        onError={() => setError(true)}
        width={size}
        height={size}
        style={active ? { boxShadow: "0 0 0 3px #60A5FA" } : undefined}
        className={`${circle ? `rounded-full` : `rounded-3xl`} ${className}`}
        src={
          error && usernameForErrorImg
            ? `https://ui-avatars.com/api/?name=${usernameForErrorImg}`
            : src
        }
      />

      {isOnline ? (
        <span className="rounded-full w-4 h-4 bg-green-500 absolute right-0 bottom-0"></span>
      ) : null}
    </div>
  );
};
