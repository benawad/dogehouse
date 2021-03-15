import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { useEffect, useState } from "react";

export const useTimeElapsed = (startDate: Date | null) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [rocketIcon, setRocketIcon] = useState("");
  const [rocketStatus, setRocketStatus] = useState("");

  const updateTime = (startDate: Date | null) => {
    if (!startDate) {
      return;
    }
    const timeDiff = differenceInMinutes(new Date(), startDate);

    setTimeElapsed(
      formatDistanceToNowStrict(startDate, {
        unit: timeDiff > 120 ? undefined : "minute",
      })
    );

    if (timeDiff < 30) {
      setRocketIcon("⛽️");
      setRocketStatus("Fueling rocket");
    } else if (timeDiff < 60) {
      setRocketIcon("🚀");
      setRocketStatus("Taking off");
    } else if (timeDiff < 240) {
      setRocketIcon("🚀✨");
      setRocketStatus("In space");
    } else if (timeDiff < 480) {
      setRocketIcon("🚀🌕");
      setRocketStatus("Approaching moon");
    } else if (timeDiff < 1440) {
      setRocketIcon("🌕🐕");
      setRocketStatus("Lunar doge");
    } else if (timeDiff < 2880) {
      setRocketIcon("🚀☀️");
      setRocketStatus("Approaching sun");
    } else {
      setRocketIcon("☀️🐕");
      setRocketStatus("Solar doge");
    }
  };

  useEffect(() => {
    updateTime(startDate);
    const intervalId = setInterval(() => updateTime(startDate), 10000);
    return () => clearInterval(intervalId);
  }, [startDate]);

  return { timeElapsed, rocketIcon, rocketStatus };
};
