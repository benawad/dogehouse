import { raw } from "../..";
import UserRequests from "./user";
import RoomRequests from "./room";
import ChatRequests from "./chat";
import MiscRequests from "./misc";
import AuthRequests from "./auth";
import { DefaultValues, EmptyObject, GroupMap, NormalObjectKey } from "../type-util";

type DefaultRequest = {
  request: EmptyObject,
  reply: EmptyObject,
  error: string
};

type RequestMap = DefaultValues<
  GroupMap<UserRequests, ":", "user"> &
  GroupMap<RoomRequests, ":", "room"> &
  GroupMap<ChatRequests, ":", "chat"> &
  GroupMap<MiscRequests, ":", "misc"> &
  GroupMap<AuthRequests, ":", "auth">,

  DefaultRequest
>;

export type Requester = <R extends NormalObjectKey<keyof RequestMap>>(
  name: R,
  data: RequestMap[R]["request"]
) => Promise<RequestMap[R]["reply"]>;

export type SimpleRequester = <R extends NormalObjectKey<keyof RequestMap>>(
  connection: raw.Connection,
  name: R,
  data: RequestMap[R]["request"]
) => Promise<RequestMap[R]["reply"]>;

export const request: SimpleRequester = async (connection, name, data) => {
  const response = await connection.sendCall(name, data) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  if(response.error) throw response.error;

  return response;
};
