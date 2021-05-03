import { request } from "./raw";

export type AuthResponse = {
  username: string;
  accessToken: string;
  refreshToken: string;
};

/**
 * Login to the api using you bot's apiKey
 * @param apiKey You bot's apiKey
 * @returns Bot's username, accessToken and refreshToken
 */
export const auth = async (apiKey: string) =>
  (await request("POST", "/bot/auth", { apiKey })) as AuthResponse;
