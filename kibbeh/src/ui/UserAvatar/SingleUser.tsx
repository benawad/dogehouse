import React from "react";

const avatarSizeMap = {
  default: "80px",
  sm: "40px",
  xxs: "30px",
  xs: "20px",
};

const onlineIndicatorStyleMap = {
  default: {
    width: "15px",
    height: "15px",
    right: "2px",
    bottom: "-4px",
    borderWidth: "4px",
  },
  xxs: {
    width: "6px",
    height: "6px",
    right: "1px",
    bottom: "-1px",
    borderWidth: "1px",
  },
  sm: {
    width: "8px",
    height: "8px",
    right: "2px",
    bottom: "-2px",
    borderWidth: "2px",
  },
  xs: {
    width: "4px",
    height: "4px",
    right: "0px",
    bottom: "-1px",
    borderWidth: "1px",
  },
};

export interface AvatarProps {
  size: keyof typeof onlineIndicatorStyleMap;
  src: string;
  className?: string;
  isOnline?: boolean;
}

export const SingleUser: React.FC<AvatarProps> = ({
  src,
  size = "default",
  className = "",
  isOnline = false,
}) => {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: avatarSizeMap[size],
        height: avatarSizeMap[size],
      }}
      data-testid="single-user-avatar"
    >
      <img alt="avatar" className="rounded-full w-full h-full" src={src} />
      {isOnline && (
        <span
          className={
            "rounded-full absolute box-content bg-accent border-primary-800"
          }
          style={onlineIndicatorStyleMap[size]}
          data-testid="online-indictor"
        ></span>
      )}
    </div>
  );
};
