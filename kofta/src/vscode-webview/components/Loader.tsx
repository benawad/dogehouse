import React, { useState } from "react";
import { Codicon } from "../svgs/Codicon";
import { tw } from "twind";

interface LoaderProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Loader: React.FC<LoaderProps> = ({
  className,
  height = 45,
  width = 45,
}) => {
  return (
    <div className={tw`flex items-center justify-center ${className}`}>
      <Codicon
        name="refresh"
        width={width}
        height={height}
        className={tw`animate-spin`}
      />
    </div>
  );
};
