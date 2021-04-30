import { Http } from "./raw";

export type AuthResponse = {
  username: string;
  accessToken: string;
  refreshToken: string;
};

export const wrap = (http: Http) => {
  return {
    auth: (apiKey: string) =>
      http.request("POST", "/bot/auth", { apiKey }) as Promise<AuthResponse>,
    testUser: (username: string) =>
      http.request("GET", `/dev/test-info?username=${username}`) as Promise<{
        accessToken: string;
        refreshToken: string;
      }>,
  };
};
