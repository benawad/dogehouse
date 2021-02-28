export const __prod__ = process.env.NODE_ENV === "production";
export const __staging__ = process.env.REACT_APP_IS_STAGING === "true";

export const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  (__prod__ ? "https://api.dogehouse.tv" : "http://192.168.1.165:4001");

export const linkRegex = /(https?:\/\/|)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
