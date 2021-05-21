import { raw } from "../..";
import LegacyRequests from "./legacy";
import { NormalObjectKey } from "../type-util";

type EventMap = LegacyRequests;

export type EventHandler<D extends EventMap[keyof EventMap]> = (data: D) => void;
export type Unsubscriber = () => void;

export type Subscriber = <E extends NormalObjectKey<keyof EventMap>>(
  name: E,
  handler: EventHandler<EventMap[E]>,
  options?: { once?: boolean }
) => Unsubscriber;

export type SimpleSubscriber = <E extends NormalObjectKey<keyof EventMap>>(
  connection: raw.Connection,
  name: E,
  handler: EventHandler<EventMap[E]>,
  options?: { once?: boolean }
) => Unsubscriber;

export const subscribe: SimpleSubscriber = (connection, name, handler, { once = false } = {}) => {
  const unsubscribe = connection.addListener(
    name,
    once
      ? data => {
        unsubscribe();
        handler(data as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      }
      : handler as any // eslint-disable-line @typescript-eslint/no-explicit-any
  );

  return unsubscribe;
};
