import React from "react";

export interface VolumeSliderProps {
  label?: boolean;
  max?: string;
  volume: number;
  onVolume: (n: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  max = "100",
  volume,
  onVolume,
}) => {
  return (
    <div className={`flex flex-col`}>
      <div className={`text-primary-300`}>
        {label ? "volume: " : ""} {volume}
      </div>
      <input
        type="range"
        min="1"
        max={max}
        value={volume}
        onChange={(e) => {
          const n = parseInt(e.target.value);
          onVolume(n);
        }}
      />
    </div>
  );
};
