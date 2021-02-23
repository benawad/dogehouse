export const __prod__ = process.env.NODE_ENV === "production";

export const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  (__prod__
    ? "https://api.dogehouse.tv"
    : "https://doge-staging.stripcode.dev");
