import * as React from "react";
import AddToCalendar from "./AddToCalendar";
import "../../../css/add-to-calendar-button.css";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";

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
		<AddToCalendar
			children={t("components.addToCalendar.add")}
			event={event}
			filename={event.name}
		/>
	);
};
