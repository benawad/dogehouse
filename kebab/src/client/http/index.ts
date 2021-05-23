import { Endpoint } from "./endpoint";
import fetch from "isomorphic-fetch";

export const apiUrl = "https://api.dogehouse.tv";

export type HTTPRequester = <O, R>(endpoint: Endpoint<O, R>, options: O) => Promise<R>;
export const httpRequest: HTTPRequester = async (endpoint, options) => {
  const [address, fetchOptions] = endpoint(options);

  const response = await fetch(apiUrl + address, fetchOptions);

  return await response.json() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export * as httpEndpoint from "./endpoint";

