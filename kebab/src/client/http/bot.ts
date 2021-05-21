import { Endpoint } from "./endpoint";

export const auth: Endpoint<
  { apiKey: string },
  { username: string, accessToken: string, refreshToken: string }
> = ({ apiKey }) => [
  "/bot/auth",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{ "apiKey": "${apiKey}" }`
  }
];
