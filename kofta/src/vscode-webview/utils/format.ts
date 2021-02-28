var { format: dfsFormat } = require("date-fns");

// This auto converts UTC to local
export const format = (timestamp: string, format = "hh:mm aaa") => {
  const date = new Date(timestamp);
  return dfsFormat(date, format);
};
