import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export interface VolumeSliderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: boolean;
  max?: number;
  volume: number;
  onVolume: (n: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  max = 100,
  volume,
  onVolume,
}) => {
  return (
    <div className={`flex flex-col w-full`}>
      <div
        className={`flex text-primary-300 w-full text-center justify-center mb-1`}
      >
        {label ? "volume: " : ""} {volume}
      </div>
      <Slider
        min={0}
        max={max}
        value={volume}
        railStyle={{ backgroundColor: "var(--color-primary-300)" }}
        trackStyle={{ backgroundColor: "var(--color-primary-300)" }}
        handleStyle={{
          backgroundColor: "var(--color-primary-100)",
          border: "none",
        }}
        onChange={(v) => {
          onVolume(v);
        }}
      />
    </div>
  );
};
