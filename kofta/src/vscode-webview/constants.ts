export const __prod__ = process.env.NODE_ENV === "production";

export const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
<<<<<<< HEAD
  (__prod__
    ? "https://api.dogehouse.tv"
    : "https://doge-staging.stripcode.dev/help");
=======
  (__prod__ ? "https://api.dogehouse.tv" : "http://192.168.1.165:4001");

export const linkRegex = /(https?:\/\/|)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
>>>>>>> 693bada3f2167a808ae726913d78010eedf04c1a
