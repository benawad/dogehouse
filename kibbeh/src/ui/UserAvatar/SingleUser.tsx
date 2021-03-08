import React from "react";

type size = "default" | "sm" | "xs";

export interface AvatarProps {
  src: string;
  size?: size;
  className?: string;
  isOnline?: boolean;
}

const avatarSizeMap = {
  default: "80px",
  sm: "40px",
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

export const SingleUser: React.FC<AvatarProps> = ({
  src,
  size = "default",
  className,
  isOnline = false,
}) => {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: avatarSizeMap[size],
        height: avatarSizeMap[size],
      }}
    >
      <img
        alt="avatar"
        className="rounded-full"
        src={src}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
      {isOnline && (
        <span
          className={
            "rounded-full absolute box-content bg-accent border-gray-800"
          }
          style={onlineIndicatorStyleMap[size]}
        ></span>
      )}
    </div>
  );
};
