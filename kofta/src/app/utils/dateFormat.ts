import { format } from "date-fns";

// This auto converts UTC to local
export const dateFormat = (timestamp: string, formatString = "hh:mm aaa") => {
  const date = new Date(timestamp);
  return format(date, formatString);
};
