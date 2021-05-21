import { request, Requester } from "./requester";
import { subscribe, Subscriber } from "./subscriber";
import { raw } from "../index";

export type Client = raw.Connection & {
  request: Requester,
  subscribe: Subscriber
};

export const createClient = (connection: raw.Connection): Client => ({
  ...connection,
  request: (name, data) => request(connection, name, data),
  subscribe: (name, handler, options = {}) => subscribe(connection, name, handler, options),
});

export * from "./http";
export * from "./requester";
export * from "./subscriber";
