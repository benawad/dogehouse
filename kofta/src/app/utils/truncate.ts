export const truncate = (
  string: string = "",
  maxChars: number = 100,
  maxLines: number = 6,
): [string, boolean] => {
  if (string.length > maxChars) {
    return [string.substring(0, maxChars) + "...", true];
  }
  const lines = string.split("\n");
  if (lines.length > maxLines) {
    return [lines.slice(0, maxLines).join("\n") + "...", true];
  }
  return [string, false];
};

