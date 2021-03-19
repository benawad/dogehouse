import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import differenceInMinutes from "date-fns/differenceInMinutes";
import { useEffect, useState } from "react";
import { useTypeSafeTranslation } from "./useTypeSafeTranslation";

export const useTimeElapsed = (startDate: Date | null) => {
  const [timeElapsed, setTimeElapsed] = useState("");
  const [rocketIcon, setRocketIcon] = useState("");
  const [rocketStatus, setRocketStatus] = useState("");

  const { t } = useTypeSafeTranslation();

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
      setRocketStatus(t("modules.roomStatus.fuelingRocket"));
    } else if (timeDiff < 60) {
      setRocketIcon("🚀");
      setRocketStatus(t("modules.roomStatus.takingOff"));
    } else if (timeDiff < 240) {
      setRocketIcon("🚀✨");
      setRocketStatus(t("modules.roomStatus.inSpace"));
    } else if (timeDiff < 480) {
      setRocketIcon("🚀🌕");
      setRocketStatus(t("modules.roomStatus.approachingMoon"));
    } else if (timeDiff < 1440) {
      setRocketIcon("🌕🐕");
      setRocketStatus(t("modules.roomStatus.lunarDoge"));
    } else if (timeDiff < 2880) {
      setRocketIcon("🚀☀️");
      setRocketStatus(t("modules.roomStatus.approachingSun"));
    } else if (timeDiff < 5760) {
      setRocketIcon("☀️🐕");
      setRocketStatus(t("modules.roomStatus.solarDoge"));
    } else if (timeDiff < 11520) {
      setRocketIcon("🚀🌌");
      setRocketStatus(t("modules.roomStatus.approachingGalaxy"));
    } else if (timeDiff < 23040) {
      setRocketIcon("🌌🐕");
      setRocketStatus(t("modules.roomStatus.galacticDoge"));
    } else {
      setRocketIcon("🪐👾");
      setRocketStatus(t("modules.roomStatus.spottedLife"));
    }
  };

  useEffect(() => {
    updateTime(startDate);
    const intervalId = setInterval(() => updateTime(startDate), 10000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate]);

  return { timeElapsed, rocketIcon, rocketStatus };
};
