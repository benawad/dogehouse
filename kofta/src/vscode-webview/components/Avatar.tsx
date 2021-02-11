import React from "react";

interface AvatarProps {
  src: string;
  size?: number;
  active?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ src, size = 70, active }) => {
  return (
    <img
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "30%",
        border: active
          ? "3px solid var(--vscode-textLink-foreground)"
          : undefined,
      }}
      src={src}
    />
  );
};
