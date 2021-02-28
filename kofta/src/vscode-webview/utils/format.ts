var dateFormat = require("dateformat");

// This auto converts UTC to local
export const format = (timestamp: string, format = "hh:MM tt") => {
  const date = new Date(timestamp);
  return dateFormat(date, format);
};
