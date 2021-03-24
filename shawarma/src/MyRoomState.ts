import { Router, Worker } from "mediasoup/lib/types";
import { MyPeer } from "./MyPeer";

export type Then<T> = T extends PromiseLike<infer U> ? U : T;

export type MyRoomState = Record<string, MyPeer>;

export type MyRooms = Record<
  string,
  { worker: Worker; router: Router; state: MyRoomState }
>;
