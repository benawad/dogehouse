import { raw, UUID } from "..";
import { RtpCapabilities, TransportOptions } from "mediasoup-client/lib/types";

export type ConsumerPlayer = (track: MediaStreamTrack, user: UUID) => void;
export type ConnectFunction<Return> = <Direction extends "input" | "output">(
  connection: raw.Connection,
  routerRtpCapabilities: RtpCapabilities,
  direction: Direction extends "input" ? "input" : "output",
  transportOptions: TransportOptions,
  track: Direction extends "input" ? MediaStreamTrack : ConsumerPlayer
) => Return;
