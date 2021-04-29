import fetch from "isomorphic-unfetch";

const BASE_URL = "https://api.dogehouse.tv";

interface Options {
  baseUrl?: string;
}

type Request = (
  method: string,
  endpoint: string,
  body?: unknown,
  opts?: Options
) => Promise<unknown>;

export type Http = {
  request: Request;
};

export const create = (baseOpts: Options): Http => {
  return {
    request: async (
      method: string,
      endpoint: string,
      body?: unknown,
      opts: Options = {}
    ) => {
      const { baseUrl = BASE_URL } = { ...baseOpts, ...opts };

      return await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      }).then((res) => res.json());
    },
  };
};

// for backward compat, you can kill this if you don't want it anymore
export const request: Request = (...params) => create({}).request(...params);
