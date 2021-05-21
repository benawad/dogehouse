import { Endpoint } from "./endpoint";

export const testInfo: Endpoint<
  { username: string },
  { accessToken: string, refreshToken: string }
> = ({ username }) => [`/dev/test-info?username=${username}`, {}];
