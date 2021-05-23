import WebSocket from "isomorphic-ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { v4 as generateUuid } from "uuid";
import { User, UUID } from "..";

const heartbeatInterval = 8000;
const apiUrl = "wss://api.dogehouse.tv/socket";
// const apiUrl = "ws://localhost:4001/socket";
const connectionTimeout = 15000;

export type Token = string;

/**
 * @deprecated
 */
export type FetchID = UUID;
export type Ref = UUID;
export type Opcode = string;
export type Logger = (
  direction: "in" | "out",
  opcode: Opcode,
  data?: unknown,
  fetchId?: Ref,
  raw?: string
) => void;
export type ListenerHandler<Data = unknown> = (
  data: Data,
  fetchId?: Ref
) => void;
export type Listener<Data = unknown> = {
  opcode: Opcode;
  handler: ListenerHandler<Data>;
};

/**
 * A reference to the websocket connection, can be created using `connect()`
 */
export type Connection = {
  close: () => void;

  /**
   * @deprecated
   */
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

  /**
   * @deprecated
   */
  send: (opcode: Opcode, data: unknown, fetchId?: FetchID) => void;
  sendCast: (opcode: Opcode, data: unknown, ref?: Ref) => void;

  /**
   * @deprecated
   */
  fetch: (
    opcode: Opcode,
    data: unknown,
    doneOpcode?: Opcode
  ) => Promise<unknown>;
  sendCall: (
    opcode: Opcode,
    data: unknown,
    doneOpcode?: Opcode
  ) => Promise<unknown>;
};

// probably want to remove token/refreshToken
// better to use getAuthOptions
// when ws tries to reconnect it should use current tokens not the ones it initializes with
/**
 * Creates a Connection object
 * @param {Token} token Your dogehouse token
 * @param {Token} refreshToken Your dogehouse refresh token
 * @returns {Promise<Connection>} Connection object
 */
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
    waitToReconnect,
  }: {
    logger?: Logger;
    onConnectionTaken?: () => void;
    onClearTokens?: () => void;
    url?: string;
    fetchTimeout?: number;
    waitToReconnect?: boolean;
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
    const api2Send = (opcode: Opcode, data: unknown, ref?: Ref) => {
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
    const apiSend = (opcode: Opcode, data: unknown, fetchId?: FetchID) => {
      // tmp fix
      // this is to avoid ws events queuing up while socket is closed
      // then it reconnects and fires before auth goes off
      // and you get logged out
      if (socket.readyState !== socket.OPEN) {
        return;
      }
      const raw = `{"op":"${opcode}","d":${JSON.stringify(data)}${
        fetchId ? `,"fetchId":"${fetchId}"` : ""
      }}`;

      socket.send(raw);
      logger("out", opcode, data, fetchId, raw);
    };

    const listeners: Listener[] = [];

    // close & message listener needs to be outside of open
    // this prevents multiple listeners from being created on reconnect
    socket.addEventListener("close", (error) => {
      // I want this here
      // eslint-disable-next-line no-console
      console.log(error);
      if (error.code === 4001) {
        socket.close();
        onClearTokens();
      } else if (error.code === 4003) {
        socket.close();
        onConnectionTaken();
      } else if (error.code === 4004) {
        socket.close();
        onClearTokens();
      }

      if (!waitToReconnect) reject(error);
    });

    socket.addEventListener("message", (e) => {
      if (e.data === `"pong"` || e.data === `pong`) {
        logger("in", "pong");

        return;
      }

      const message = JSON.parse(e.data);

      logger("in", message.op, message.d, message.fetchId, e.data);

      if (message.op === "auth-good") {
        const connection: Connection = {
          close: () => socket.close(),
          once: (opcode, handler) => {
            const listener = { opcode, handler } as Listener<unknown>;

            listener.handler = (...params) => {
              handler(...(params as Parameters<typeof handler>));
              listeners.splice(listeners.indexOf(listener), 1);
            };

            listeners.push(listener);
          },
          addListener: (opcode, handler) => {
            const listener = { opcode, handler } as Listener<unknown>;

            listeners.push(listener);

            return () => listeners.splice(listeners.indexOf(listener), 1);
          },
          user: message.d.user,
          send: apiSend,
          sendCast: api2Send,
          sendCall: (
            opcode: Opcode,
            parameters: unknown,
            doneOpcode?: Opcode
          ) =>
            new Promise((resolveCall, rejectFetch) => {
              // tmp fix
              // this is to avoid ws events queuing up while socket is closed
              // then it reconnects and fires before auth goes off
              // and you get logged out
              if (socket.readyState !== socket.OPEN) {
                rejectFetch(new Error("websocket not connected"));

                return;
              }
              const ref: FetchID | false = !doneOpcode && generateUuid();
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
                  rejectFetch(new Error("timed out"));
                }, fetchTimeout);
              }

              api2Send(opcode, parameters, ref || undefined);
            }),
          fetch: (opcode: Opcode, parameters: unknown, doneOpcode?: Opcode) =>
            new Promise((resolveFetch, rejectFetch) => {
              // tmp fix
              // this is to avoid ws events queuing up while socket is closed
              // then it reconnects and fires before auth goes off
              // and you get logged out
              if (socket.readyState !== socket.OPEN) {
                rejectFetch(new Error("websocket not connected"));

                return;
              }
              const fetchId: FetchID | false = !doneOpcode && generateUuid();
              let timeoutId: NodeJS.Timeout | null = null;
              const unsubscribe = connection.addListener(
                doneOpcode ?? "fetch_done",
                (data, arrivedId) => {
                  if (!doneOpcode && arrivedId !== fetchId) return;

                  if (timeoutId) clearTimeout(timeoutId);

                  unsubscribe();
                  resolveFetch(data);
                }
              );

              if (fetchTimeout) {
                timeoutId = setTimeout(() => {
                  unsubscribe();
                  rejectFetch(new Error("timed out"));
                }, fetchTimeout);
              }

              apiSend(opcode, parameters, fetchId || undefined);
            }),
        };

        resolve(connection);
      } else {
        listeners
          .filter(({ opcode }) => opcode === message.op)
          .forEach((it) =>
            it.handler(message.d || message.p, message.fetchId || message.ref)
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
