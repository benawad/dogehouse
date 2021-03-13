import { format, formatDistance } from "date-fns";

// This auto converts UTC to local
export const dateFormat = (timestamp: string, formatString = "hh:mm aaa") => {
	const date = new Date(timestamp);
	return format(date, formatString);
};

export const humanDuration = (timestamp: string) => {
	const date = new Date(timestamp);
	return formatDistance(date, Date.now()) + " ago";
};
