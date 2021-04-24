import { differenceInSeconds } from "date-fns";
import React, { useEffect, useState } from "react";

interface DurationTickerProps {
  dt: Date;
}

const pad = (s: number) => (s < 10 ? `0${s}` : "" + s);

export const DurationTicker: React.FC<DurationTickerProps> = ({ dt }) => {
  const [_, rerender] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      rerender((c) => c + 1);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  let totalSeconds = differenceInSeconds(new Date(), dt);

  const parts: string[] = [];
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    parts.push(pad(hours));
  }
  parts.push(pad(minutes));
  parts.push(pad(seconds));

  return <>{parts.join(":")}</>;
};
