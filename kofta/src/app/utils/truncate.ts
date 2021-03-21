export const truncate = (
    string = "",
    maxChars = 100,
    maxLines = 6,
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

