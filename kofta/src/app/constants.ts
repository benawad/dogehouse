export const __prod__ = process.env.NODE_ENV === "production";
export const __staging__ = process.env.REACT_APP_IS_STAGING === "true";

export const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  (__prod__ ? "https://api.dogehouse.tv" : "http://192.168.1.165:4001");

export const linkRegex = /(https?:\/\/)(www\.)?([-a-z0-9]{1,63}\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\.[a-z]{1,6}(\/[-\\w@\\+\\.~#\\?&/=%]*)?[^\s()]+/;
