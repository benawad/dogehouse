import WebSocket from "isomorphic-ws";
import ReconnectingWebSocket from "reconnecting-websocket";
import { v4 as generateUuid } from "uuid";
import { User, UUID } from "./entities";

const heartbeatInterval = 8000;
const apiUrl = "wss://api.dogehouse.tv/socket";
const connectionTimeout = 15000;

export type Token = string;
export type FetchID = UUID;
export type Opcode = string;
export type Logger = (
  direction: "in" | "out",
  opcode: Opcode,
  data?: unknown,
  fetchId?: FetchID,
  raw?: string
) => void;
export type ListenerHandler = (data: unknown, fetchId?: FetchID) => void;
export type Listener = {
  opcode: Opcode;
  handler: ListenerHandler;
};

export type Connection = {
  addListener: (opcode: Opcode, handler: ListenerHandler) => () => void;
  user: User;
  send: (opcode: Opcode, data: unknown, fetchId?: FetchID) => void;
  fetch: (
    opcode: Opcode,
    data: unknown,
    doneOpcode?: Opcode
  ) => Promise<unknown>;
};

export const connect = (
  token: Token,
  refreshToken: Token,
  {
    logger = () => {},
    onConnectionTaken = () => {},
    url = apiUrl,
  }: { logger?: Logger; onConnectionTaken?: () => void; url?: string }
): Promise<Connection> =>
  new Promise((resolve, reject) => {
    const socket = new ReconnectingWebSocket(url, [], {
      connectionTimeout,
      WebSocket,
    });
    const apiSend = (opcode: Opcode, data: unknown, fetchId?: FetchID) => {
      const raw = `{"op":"${opcode}","d":${JSON.stringify(data)}${
        fetchId ? `,"fetchId":"${fetchId}"` : ""
      }}`;

      socket.send(raw);
      logger("out", opcode, data, fetchId, raw);
    };

    const listeners: Listener[] = [];

    socket.addEventListener("open", () => {
      const heartbeat = setInterval(() => {
        socket.send("ping");
        logger("out", "ping");
      }, heartbeatInterval);

      socket.addEventListener("close", (error) => {
        clearInterval(heartbeat);
        if (error.code === 4003) onConnectionTaken();
        reject(error);
      });

      apiSend("auth", {
        accessToken: token,
        refreshToken,
        reconnectToVoice: false,
        currentRoomId: null,
        muted: false,
        platform: "uhhh web sure",
      });

      socket.addEventListener("message", (e) => {
        if (e.data === `"pong"`) {
          logger("in", "pong");

          return;
        }

        const message = JSON.parse(e.data);

        logger("in", message.op, message.d, message.fetchId, e.data);

        if (message.op === "auth-good") {
          const connection: Connection = {
            addListener: (opcode: Opcode, handler: ListenerHandler) => {
              const listener = { opcode, handler };

              listeners.push(listener);

              return () => listeners.splice(listeners.indexOf(listener));
            },
            user: message.d.user,
            send: apiSend,
            fetch: (opcode: Opcode, parameters: unknown, doneOpcode?: Opcode) =>
              new Promise((resolveFetch) => {
                const fetchId: FetchID | false = !doneOpcode && generateUuid();

                const unsubscribe = connection.addListener(
                  doneOpcode ?? "fetch_done",
                  (data, arrivedId) => {
                    if (!doneOpcode && arrivedId !== fetchId) return;
                    resolveFetch(data);
                    unsubscribe();
                  }
                );

                apiSend(opcode, parameters, fetchId || undefined);
              }),
          };

          resolve(connection);
        } else {
          listeners
            .filter(({ opcode }) => opcode === message.op)
            .forEach((it) => it.handler(message.d, message.fetchId));
        }
      });
    });
  });
