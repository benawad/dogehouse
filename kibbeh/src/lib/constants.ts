export const __prod__ = process.env.NODE_ENV === "production";
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === "true";
export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://dogehouse.tv";
export const loginNextPathKey = "@dogehouse/login-next";

export const linkRegex = /(^|\s)(https?:\/\/)(www\.)?([-a-z0-9]{1,63}\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\.[a-z]{1,6}(\/[-\\w@\\+\\.~#\\?&/=%]*)?[^\s()]+/;
export const codeBlockRegex = /`([^`]*)`/g;
export const mentionRegex = /^(?!.*\bRT\b)(?:.+\s)?#?@\w+/i;
