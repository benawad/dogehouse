export type Endpoint<O, R> = (options: O) => [string, RequestInit]; // eslint-disable-line @typescript-eslint/no-unused-vars

export * as dev from "./dev";
export * as bot from "./bot";
