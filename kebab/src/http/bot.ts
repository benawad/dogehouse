import { request } from "./raw";

export type AuthResponse = {
  username: string;
  accessToken: string;
  refreshToken: string;
};

export const auth = async (apiKey: string) =>
  await request("POST", "/bot/auth", { apiKey }) as AuthResponse;
