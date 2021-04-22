import React, { useState } from "react";

export interface VolumeIndicatorProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  volume: number /** 0-100 */;
  bars?: number /** 1-inf */;
}

export const VolumeIndicator: React.FC<VolumeIndicatorProps> = ({
  volume = 0,
  bars = 24,
  ...props
}) => {
  const hBars: React.ReactNode[] = [];
  for (let i = 0; i < bars; i++) {
    hBars.push(
      <div
        key={i}
        className={`h-full rounded-full w-1 transition ${
          Math.round((volume * bars) / 100) >= i && volume > 0
            ? "bg-primary-100"
            : "bg-primary-700"
        }`}
      ></div>
    );
  }
  return (
    <div {...props} className="w-auto h-4 flex gap-1.5">
      {hBars}
    </div>
  );
};
