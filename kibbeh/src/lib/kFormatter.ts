export const kFormatter = (n: number) => {
  if (n < 1000) {
    return `${n}`;
  }

  const base = Math.floor(Math.log(Math.abs(n)) / Math.log(1000));
  const suffix = "kmb"[base - 1];
  const abbrev = String(n / 1000 ** base).substring(0, 3);
  return (abbrev.endsWith(".") ? abbrev.slice(0, -1) : abbrev) + suffix;
};
