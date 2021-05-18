import React from "react";

interface BotIconProps {
  alt?: string;
  src: string;
  onClick: () => any;
}

export const BotIcon: React.FC<BotIconProps> = ({ alt, src, onClick }) => {
  return (
    <div
      className="mb-2 grid"
      style={{ width: 120, height: 120 }}
      data-testid="single-user-avatar"
    >
      <img
        alt={alt}
        className={"rounded-full w-full h-full object-cover relative"}
        style={{ gridColumn: 1, gridRow: 1 }}
        src={src}
      />
    </div>
  );
};
