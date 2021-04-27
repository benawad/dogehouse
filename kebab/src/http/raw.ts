import fetch from "isomorphic-unfetch";

const BASE_URL = "https://api.dogehouse.tv";

export const request = async (method: string, endpoint: string, body: unknown): Promise<unknown> =>
  await fetch(
    BASE_URL + endpoint,
    { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  )
    .then(res => res.json());
