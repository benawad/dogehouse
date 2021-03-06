import * as React from "react";
import AddToCalendar from "./AddToCalendar";
import { useTranslation } from "react-i18next";
import "../../../css/add-to-calendar-button.css";

interface ScheduledEvent {
	event: ScheduledEventProps
}

interface ScheduledEventProps {
	name: string;
	details: string;
	location: string;
	startsAt: string;
	endsAt: string;
}

export const AddToCalendarButton: React.FC<ScheduledEvent> = ({
  event
}) => {
	const { t } = useTranslation();
	return <AddToCalendar
		children={t("components.addToCalendar.add")}
		event={event}
		filename={event.name}
	/>;
};
