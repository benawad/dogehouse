import * as React from "react";
import AddToCalendar from "./AddToCalendar";

import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";

interface ScheduledEvent {
  event: ScheduledEventProps;
}

interface ScheduledEventProps {
  name: string;
  details: string;
  location: string;
  startsAt: string;
  endsAt: string;
}

export const AddToCalendarButton: React.FC<ScheduledEvent> = ({ event }) => {
  const { t } = useTypeSafeTranslation();
  return (
    <AddToCalendar event={event} filename={event.name}>
      {t("components.addToCalendar.add")}
    </AddToCalendar>
  );
};
