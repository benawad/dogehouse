import WebSocket from "isomorphic-ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { v4 as generateUuid } from "uuid";
import { User, UUID } from "..";

const heartbeatInterval = 8000;
const apiUrl = "wss://api.dogehouse.tv/socket";
const connectionTimeout = 15000;

export type Token = string;
export type Ref = UUID;
export type Opcode = string;
export type Logger = (
  direction: "in" | "out",
  opcode: Opcode,
  data?: unknown,
  ref?: Ref,
  raw?: string
) => void;
export type ListenerHandler<Data = unknown> = (
  data: Data,
  ref?: Ref
) => void;
export type Listener<Data = unknown> = {
  opcode: Opcode;
  handler: ListenerHandler<Data>;
};

export type Connection = {
  close: () => void;
  once: <Data = unknown>(
    opcode: Opcode,
    handler: ListenerHandler<Data>
  ) => void;
  addListener: <Data = unknown>(
    opcode: Opcode,
    handler: ListenerHandler<Data>
  ) => () => void;
  user: User;
  initialCurrentRoomId?: string;
  send: (opcode: Opcode, data: unknown, ref?: Ref) => void;
  sendCall: (
    opcode: Opcode,
    data: unknown,
    doneOpcode?: Opcode
  ) => Promise<unknown>;
};

// probably want to remove token/refreshToken
// better to use getAuthOptions
// when ws tries to reconnect it should use current tokens not the ones it initializes with
export const connect = (
  token: Token,
  refreshToken: Token,
  {
    logger = () => {},
    onConnectionTaken = () => {},
    onClearTokens = () => {},
    url = apiUrl,
    fetchTimeout,
    getAuthOptions,
  }: {
    logger?: Logger;
    onConnectionTaken?: () => void;
    onClearTokens?: () => void;
    url?: string;
    fetchTimeout?: number;
    getAuthOptions?: () => Partial<{
      reconnectToVoice: boolean;
      currentRoomId: string | null;
      muted: boolean;
      deafened: boolean;
      token: Token;
      refreshToken: Token;
    }>;
  }
): Promise<Connection> =>
  new Promise((resolve, reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
    });
    const apiSend = (opcode: Opcode, data: unknown, ref?: Ref) => {
      // tmp fix
      // this is to avoid ws events queuing up while socket is closed
      // then it reconnects and fires before auth goes off
      // and you get logged out
      if (socket.readyState !== socket.OPEN) return;

      const raw = `{"v":"0.2.0", "op":"${opcode}","p":${JSON.stringify(data)}${
        ref ? `,"ref":"${ref}"` : ""
      }}`;

      socket.send(raw);
      logger("out", opcode, data, ref, raw);
    };

    const listeners: Listener[] = [];

    // close & message listener needs to be outside of open
    // this prevents multiple listeners from being created on reconnect
    socket.addEventListener("close", (error) => {
      // I want this here
      // eslint-disable-next-line no-console
      console.log(error);
      if (error.code === 4001 || error.code === 4004) {
        socket.close();
        onClearTokens();
      } else if (error.code === 4003) {
        socket.close();
        onConnectionTaken();
      }

      reject(error);
    });

    socket.addEventListener("message", (e) => {
      if (e.data === `"pong"` || e.data === `pong`) {
        logger("in", "pong");

        return;
      }

      const message = JSON.parse(e.data);

      logger("in", message.op, message.d, message.ref, e.data);

      if (message.op === "auth-good") {
        const connection: Connection = {
          close: () => socket.close(),
          once: (opcode, handler) => {
            const listener = { opcode, handler } as Listener;

            listener.handler = (...params) => {
              handler(...(params as Parameters<typeof handler>));
              listeners.splice(listeners.indexOf(listener), 1);
            };

            listeners.push(listener);
          },
          addListener: (opcode, handler) => {
            const listener = { opcode, handler } as Listener;

            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
          user: message.d.user,
          initialCurrentRoomId: message.d.currentRoom?.id,
          send: apiSend,
          sendCall: (
            opcode: Opcode,
            parameters: unknown,
            doneOpcode?: Opcode
          ) =>
            new Promise((resolveCall, rejectCall) => {
              // tmp fix
              // this is to avoid ws events queuing up while socket is closed
              // then it reconnects and fires before auth goes off
              // and you get logged out
              if (socket.readyState !== socket.OPEN) {
                rejectCall(new Error("websocket not connected"));

                return;
              }

              const ref: Ref | false = !doneOpcode && generateUuid();
              let timeoutId: NodeJS.Timeout | null = null;
              const unsubscribe = connection.addListener(
                doneOpcode ?? opcode + ":reply",
                (data, arrivedId) => {
                  if (!doneOpcode && arrivedId !== ref) return;

                  if (timeoutId) clearTimeout(timeoutId);

                  unsubscribe();
                  resolveCall(data);
                }
              );

              if (fetchTimeout) {
                timeoutId = setTimeout(() => {
                  unsubscribe();
                  rejectCall(new Error("timed out"));
                }, fetchTimeout);
              }

              apiSend(opcode, parameters, ref || undefined);
            }),
        };

        resolve(connection);
      } else {
        listeners
          .filter(({ opcode }) => opcode === message.op)
          .forEach((it) =>
            it.handler(message.d || message.p, message.ref || message.ref)
          );
      }
    });

    socket.addEventListener("open", () => {
      const id = setInterval(() => {
        if (socket.readyState === socket.CLOSED) {
          clearInterval(id);
        } else {
          socket.send("ping");
          logger("out", "ping");
        }
      }, heartbeatInterval);

      apiSend("auth", {
        accessToken: token,
        refreshToken,
        reconnectToVoice: false,
        currentRoomId: null,
        muted: false,
        deafened: false,
        ...getAuthOptions?.(),
      });
    });
  });
