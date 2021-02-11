export const __prod__ = process.env.NODE_ENV === "production";

export const apiBaseUrl = __prod__
  ? "https://api.dogehouse.tv"
  : "http://192.168.1.165:4001";
