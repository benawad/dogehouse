import { wrap } from "@dogehouse/kebab";
import { useContext } from "react";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";

export const useConn = () => {
  return useContext(WebSocketContext).conn!;
};

export const useWrappedConn = () => {
  return wrap(useContext(WebSocketContext).conn!);
};
