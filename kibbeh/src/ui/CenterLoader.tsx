import React from "react";
import { Spinner } from "./Spinner";

interface CenterLoaderProps {}

export const CenterLoader: React.FC<CenterLoaderProps> = ({}) => {
  return (
    <div className={`w-full h-full items-center justify-center`}>
      <Spinner />
    </div>
  );
};
