export const truncate = (string: string, max: number = 100) =>
  string.length > max ? string.substring(0, max) + "..." : string;
