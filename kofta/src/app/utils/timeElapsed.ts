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
    
    switch (true) {

      case (timeDiff < 30): {
        setRocketIcon("⛽️");
        setRocketStatus(t("modules.roomStatus.fuelingRocket"));
        break;
      }
      case (timeDiff < 60): {
        setRocketIcon("🚀");
        setRocketStatus(t("modules.roomStatus.takingOff"));
        break;
      }
      case (timeDiff < 240): {
        setRocketIcon("🚀✨");
        setRocketStatus(t("modules.roomStatus.inSpace"));
        break;
      }
      case (timeDiff < 480): {
        setRocketIcon("🚀🌕");
        setRocketStatus(t("modules.roomStatus.approachingMoon"));
        break;
      }
      case (timeDiff < 1440): {
        setRocketIcon("🌕🐕");
        setRocketStatus(t("modules.roomStatus.lunarDoge"));
        break;
      }
      case (timeDiff < 2880): {
        setRocketIcon("🚀☀️");
        setRocketStatus(t("modules.roomStatus.approachingSun"));
        break;
      }
      case (timeDiff < 5760): {
        setRocketIcon("☀️🐕");
        setRocketStatus(t("modules.roomStatus.solarDoge"));
        break;
      }
      case (timeDiff < 11520): {
        setRocketIcon("🚀🌌");
        setRocketStatus(t("modules.roomStatus.approachingGalaxy"));
        break;
      }
      case (timeDiff < 23040): {
        setRocketIcon("🌌🐕");
        setRocketStatus(t("modules.roomStatus.galacticDoge"));
        break;
      }
      case (timeDiff < 23041): {
        setRocketIcon("🪐👾");
        setRocketStatus(t("modules.roomStatus.spottedLife"));
        break;
      }  
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
