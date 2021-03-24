import { raw, UUID } from "..";
import { RtpCapabilities, TransportOptions } from "mediasoup-client/lib/types";
import { Device } from "mediasoup-client";

export type ConsumerPlayer = (track: MediaStreamTrack, user: UUID) => void;
export type ConnectFunction = <Direction extends "input" | "output">(
  connection: raw.Connection,
  device: Device,
  routerRtpCapabilities: RtpCapabilities,
  direction: Direction extends "input" ? "input" : "output",
  transportOptions: TransportOptions,
  track: Direction extends "input" ? MediaStreamTrack : ConsumerPlayer
) => Promise<void>;
