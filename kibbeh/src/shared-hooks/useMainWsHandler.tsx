import { wrap } from "@dogehouse/kebab";
import isElectron from "is-electron";
import { useRouter } from "next/router";
import { FC, useContext, useEffect } from "react";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { useRoomChatMentionStore } from "../global-stores/useRoomChatMentionStore";
import { showErrorToast } from "../lib/showErrorToast";
import { useTokenStore } from "../modules/auth/useTokenStore";
import {
  RoomChatMessageToken,
  useRoomChatStore,
} from "../modules/room/chat/useRoomChatStore";
import { mergeRoomPermission } from "../modules/webrtc/utils/mergeRoomPermission";
import { WebSocketContext } from "../modules/ws/WebSocketProvider";
import { invitedToRoomConfirm } from "../shared-components/InvitedToJoinRoomModal";
import { setMute } from "./useSetMute";
import { useTypeSafeUpdateQuery } from "./useTypeSafeUpdateQuery";

let ipcRenderer: any = undefined;
if (isElectron()) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export const useMainWsHandler = () => {
  const { push } = useRouter();
  const { conn } = useContext(WebSocketContext);
  const updateQuery = useTypeSafeUpdateQuery();

  useEffect(() => {
    if (!conn) {
      return;
    }
    const unsubs = [
      conn.addListener<any>(
        "new_room_details",
        ({ name, description, isPrivate, roomId }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  room: {
                    ...data.room,
                    name,
                    description,
                    isPrivate,
                  },
                }
          );
        }
      ),
      conn.addListener<any>("error", (message) => {
        showErrorToast(message);
      }),
      conn.addListener<any>("chat_user_unbanned", ({ userId }) => {
        useRoomChatStore.getState().unbanUser(userId);
      }),
      conn.addListener<any>("chat_user_banned", ({ userId }) => {
        useRoomChatStore.getState().addBannedUser(userId);
      }),
      conn.addListener<any>("new_chat_msg", ({ msg }) => {
        const { open } = useRoomChatStore.getState();
        useRoomChatStore.getState().addMessage(msg);
        const { isRoomChatScrolledToTop } = useRoomChatStore.getState();
        if (
          (!open || !document.hasFocus() || isRoomChatScrolledToTop) &&
          !!msg.tokens.filter(
            (t: RoomChatMessageToken) =>
              t.t === "mention" &&
              t.v?.toLowerCase() === conn.user.username.toLowerCase()
          ).length
        ) {
          useRoomChatMentionStore.getState().incrementIAmMentioned();
          if (isElectron()) {
            ipcRenderer.send("@notification/mention", msg);
          }
        }
      }),
      conn.addListener<any>("message_deleted", ({ messageId, deleterId }) => {
        const { messages, setMessages } = useRoomChatStore.getState();
        setMessages(
          messages.map((m) => ({
            ...m,
            deleted: m.id === messageId || !!m.deleted,
            deleterId: m.id === messageId ? deleterId : m.deleterId,
          }))
        );
      }),
      conn.addListener<any>(
        "room_privacy_change",
        ({ roomId, isPrivate, name }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  room: {
                    ...data.room,
                    name,
                    isPrivate,
                  },
                }
          );
        }
      ),
      conn.addListener<any>(
        "room_chat_throttle_change",
        ({ roomId, chatThrottle, name }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  room: {
                    ...data.room,
                    name,
                    chatThrottle,
                  },
                }
          );
        }
      ),
      conn.addListener<any>(
        "room_chat_mode_changed",
        ({ roomId, chatMode }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  room: {
                    ...data.room,
                    chatMode,
                  },
                }
          );
        }
      ),
      conn.addListener<any>("banned", () => {
        showErrorToast("you got banned");
        conn.close();
        useTokenStore
          .getState()
          .setTokens({ accessToken: "", refreshToken: "" });
      }),
      conn.addListener<any>("ban_done", ({ worked }) => {
        if (worked) {
          showErrorToast("ban worked");
        } else {
          showErrorToast("ban failed");
        }
      }),
      conn.addListener<any>("someone_you_follow_created_a_room", (value) => {
        invitedToRoomConfirm(value, push);
        if (isElectron()) {
          ipcRenderer.send("@notification/indirect_invitation", value);
        }
      }),
      conn.addListener<any>("invitation_to_room", (value) => {
        invitedToRoomConfirm(value, push);
        if (isElectron()) {
          ipcRenderer.send("@notification/invitation", value);
        }
      }),
      conn.addListener<any>(
        "active_speaker_change",
        ({ roomId, activeSpeakerMap }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  activeSpeakerMap,
                }
          );
        }
      ),
      conn.addListener<any>("room_destroyed", ({ roomId }) => {
        useCurrentRoomIdStore
          .getState()
          .setCurrentRoomId((id) => (id === roomId ? null : id));

        updateQuery(["joinRoomAndGetInfo", roomId], (data) => ({
          // @todo change to an error code
          error: "room gone",
        }));
      }),
      conn.addListener<any>("new_room_creator", ({ userId, roomId }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
          !data || "error" in data
            ? data
            : {
                ...data,
                room: {
                  ...data.room,
                  creatorId: userId,
                },
              }
        );
      }),
      conn.addListener<any>(
        "speaker_removed",
        ({ userId, roomId, muteMap, deafMap }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  muteMap,
                  deafMap,
                  users: data.users.map((x) =>
                    userId === x.id
                      ? {
                          ...x,
                          roomPermissions: mergeRoomPermission(
                            x.roomPermissions,
                            { isSpeaker: false, askedToSpeak: false }
                          ),
                        }
                      : x
                  ),
                }
          );
        }
      ),
      conn.addListener<any>(
        "speaker_added",
        ({ userId, roomId, muteMap, deafMap }) => {
          // Mute user upon added as speaker
          if (conn.user.id === userId) {
            setMute(wrap(conn), true);
          }

          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  muteMap,
                  deafMap,
                  users: data.users.map((x) =>
                    userId === x.id
                      ? {
                          ...x,
                          roomPermissions: mergeRoomPermission(
                            x.roomPermissions,
                            {
                              isSpeaker: true,
                            }
                          ),
                        }
                      : x
                  ),
                }
          );
        }
      ),
      conn.addListener<any>("mod_changed", ({ userId, roomId, isMod }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
          !data || "error" in data
            ? data
            : {
                ...data,
                users: data.users.map((x) =>
                  userId === x.id
                    ? {
                        ...x,
                        roomPermissions: mergeRoomPermission(
                          x.roomPermissions,
                          { isMod }
                        ),
                      }
                    : x
                ),
              }
        );
      }),
      conn.addListener<any>("user_left_room", ({ userId, roomId }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) => {
          if (data && "error" in data) {
            return data;
          }

          const { [userId]: _, ...asm } = data.activeSpeakerMap;
          return {
            ...data,
            activeSpeakerMap: asm,
            room: {
              ...data.room,
              peoplePreviewList: data.room.peoplePreviewList.filter(
                (x) => x.id !== userId
              ),
              numPeopleInside: data.room.numPeopleInside - 1,
            },
            users: data.users.filter((x) => x.id !== userId),
          };
        });
      }),
      conn.addListener<any>(
        "new_user_join_room",
        ({ user, muteMap, deafMap, roomId }) => {
          updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
            !data || "error" in data
              ? data
              : {
                  ...data,
                  muteMap,
                  deafMap,
                  room: {
                    ...data.room,
                    peoplePreviewList:
                      data.room.peoplePreviewList.length < 10
                        ? [
                            ...data.room.peoplePreviewList,
                            {
                              id: user.id,
                              displayName: user.displayName,
                              numFollowers: user.numFollowers,
                              avatarUrl: user.avatarUrl,
                            },
                          ]
                        : data.room.peoplePreviewList,
                    numPeopleInside: data.room.numPeopleInside + 1,
                  },
                  users: [...data.users.filter((x) => x.id !== user.id), user],
                }
          );
        }
      ),
      conn.addListener<any>("hand_raised", ({ roomId, userId }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) =>
          !data || "error" in data
            ? data
            : {
                ...data,
                users: data.users.map((u) =>
                  u.id === userId
                    ? {
                        ...u,
                        roomPermissions: mergeRoomPermission(
                          u.roomPermissions,
                          {
                            askedToSpeak: true,
                          }
                        ),
                      }
                    : u
                ),
              }
        );
      }),
      conn.addListener<any>("mute_changed", ({ userId, value, roomId }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) => {
          if (data && "error" in data) {
            return data;
          }
          let muteMap = data.muteMap;
          if (value) {
            muteMap = { ...data.muteMap, [userId]: true };
          } else {
            const { [userId]: _, ...newMm } = data.muteMap;
            muteMap = newMm;
          }
          return {
            ...data,
            muteMap,
          };
        });
      }),
      conn.addListener<any>("deafen_changed", ({ userId, value, roomId }) => {
        updateQuery(["joinRoomAndGetInfo", roomId], (data) => {
          if (data && "error" in data) {
            return data;
          }
          let deafMap = data.deafMap;
          if (value) {
            deafMap = { ...data.deafMap, [userId]: true };
          } else {
            const { [userId]: _, ...newDm } = data.deafMap;
            deafMap = newDm;
          }
          return {
            ...data,
            deafMap,
          };
        });
      }),
    ];

    return () => {
      unsubs.forEach((u) => u());
    };
  }, [conn, updateQuery, push]);
};

export const MainWsHandlerProvider: FC = ({ children }) => {
  useMainWsHandler();
  return <>{children}</>;
};
