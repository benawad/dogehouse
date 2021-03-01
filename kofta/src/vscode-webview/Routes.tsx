import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { closeWebSocket, wsend } from "../createWebsocket";
import { useMuteStore } from "../webrtc/stores/useMuteStore";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { mergeRoomPermission } from "../webrtc/utils/mergeRoomPermission";
import {
  meAtom,
  setFollowerMapAtom,
  setFollowingMapAtom,
  setFollowingOnlineAtom,
  setInviteListAtom,
  setMeAtom,
  setPublicRoomsAtom,
} from "./atoms";
import { useRoomChatMentionStore } from "./modules/room-chat/useRoomChatMentionStore";
import {
  RoomChatMessageToken,
  useRoomChatStore,
} from "./modules/room-chat/useRoomChatStore";
import { BanUsersPage } from "./pages/BanUsersPage";
import { SoundEffectSettingsPage } from "./pages/SoundEffectSettingsPage";
import { FollowingOnlineList } from "./pages/FollowingOnlineList";
import { FollowListPage } from "./pages/FollowListPage";
import { Home } from "./pages/Home";
import { InviteList } from "./pages/InviteList";
import { MyProfilePage } from "./pages/MyProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RoomPage } from "./pages/RoomPage";
import { SearchUsersPage } from "./pages/SearchUsersPage";
import { ViewUserPage } from "./pages/ViewUserPage";
import { VoiceSettingsPage } from "./pages/VoiceSettingsPage";
import { isUuid } from "./utils/isUuid";
import { roomToCurrentRoom } from "./utils/roomToCurrentRoom";
import { showErrorToast } from "./utils/showErrorToast";
import { useTokenStore } from "./utils/useTokenStore";
import { invitedToRoomConfirm } from "./components/InvitedToJoinRoomModal";
import { useCurrentRoomStore } from "../webrtc/stores/useCurrentRoomStore";

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const addMultipleWsListener = useWsHandlerStore(
    (s) => s.addMultipleWsListener
  );
  const [, setMe] = useAtom(setMeAtom);
  const [, setPublicRooms] = useAtom(setPublicRoomsAtom);
  const [, setFollowerMap] = useAtom(setFollowerMapAtom);
  const [, setFollowingMap] = useAtom(setFollowingMapAtom);
  const [, setFollowingOnline] = useAtom(setFollowingOnlineAtom);
  const [, setInviteList] = useAtom(setInviteListAtom);
  const setCurrentRoom = useCurrentRoomStore((x) => x.setCurrentRoom);

  const [me] = useAtom(meAtom);
  const meRef = useRef(me);
  meRef.current = me;

  useEffect(() => {
    addMultipleWsListener({
      new_room_name: ({ name, roomId }) => {
        setCurrentRoom((cr) =>
          !cr || cr.id !== roomId ? cr : { ...cr, name }
        );
      },
      chat_user_banned: ({ userId }) => {
        useRoomChatStore.getState().addBannedUser(userId);
      },
      new_chat_msg: ({ msg }) => {
        const { open } = useRoomChatStore.getState();
        useRoomChatStore.getState().addMessage(msg);
        if (
          (!open || !document.hasFocus()) &&
          !!msg.tokens.filter(
            (t: RoomChatMessageToken) =>
              t.t === "mention" &&
              t.v?.toLowerCase() === meRef?.current?.username?.toLowerCase()
          ).length
        ) {
          useRoomChatMentionStore.getState().incrementIAmMentioned();
        }
      },
      message_deleted({ messageId, deleterId }) {
        const { messages, setMessages } = useRoomChatStore.getState();
        setMessages(
          messages.map((m) => ({
            ...m,
            deleted: m.id === messageId || !!m.deleted,
            deleterId: m.id === messageId ? deleterId : m.deleterId,
          }))
        );
      },
      room_privacy_change: ({ roomId, isPrivate, name }) => {
        setCurrentRoom((cr) =>
          !cr || cr.id !== roomId ? cr : { ...cr, name, isPrivate }
        );
        toast(`Room is now ${isPrivate ? "private" : "public"}`, {
          type: "info",
        });
      },
      banned: () => {
        toast("you got banned", { type: "error" });
        closeWebSocket();
        useTokenStore
          .getState()
          .setTokens({ accessToken: "", refreshToken: "" });
      },
      ban_done: ({ worked }) => {
        if (worked) {
          toast("ban worked", { type: "success" });
        } else {
          toast("ban failed", { type: "error" });
        }
      },
      someone_you_follow_created_a_room: (value) => {
        invitedToRoomConfirm(value, history);
      },
      invitation_to_room: (value) => {
        invitedToRoomConfirm(value, history);
      },
      fetch_invite_list_done: ({ users, nextCursor, initial }) => {
        setInviteList((x) => ({
          users: initial ? users : [...x.users, ...users],
          nextCursor,
        }));
      },
      fetch_following_online_done: ({ users, nextCursor, initial }) => {
        setFollowingOnline((x) => ({
          users: initial ? users : [...x.users, ...users],
          nextCursor,
        }));
      },
      get_top_public_rooms_done: ({ rooms, nextCursor, initial }) => {
        setPublicRooms((r) => ({
          publicRooms: initial ? rooms : [...r.publicRooms, ...rooms],
          nextCursor,
        }));
      },
      fetch_follow_list_done: ({
        userId,
        users,
        isFollowing,
        nextCursor,
        initial,
      }) => {
        const fn = isFollowing ? setFollowingMap : setFollowerMap;
        fn((m) => ({
          ...m,
          [userId]: {
            users: initial ? users : [...m[userId].users, ...users],
            nextCursor,
          },
        }));
      },
      follow_info_done: ({ userId, followsYou, youAreFollowing }) => {
        setCurrentRoom((c) =>
          !c
            ? c
            : {
                ...c,
                users: c.users.map((x) =>
                  x.id === userId ? { ...x, followsYou, youAreFollowing } : x
                ),
              }
        );
      },
      active_speaker_change: ({ roomId, activeSpeakerMap }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId ? c : { ...c, activeSpeakerMap }
        );
      },
      room_destroyed: ({ roomId }) => {
        setCurrentRoom((c) => {
          if (c && c.id === roomId) {
            history.replace("/");
            return null;
          }
          return c;
        });
      },
      new_room_creator: ({ userId, roomId }) => {
        setCurrentRoom((cr) =>
          cr && cr.id === roomId ? { ...cr, creatorId: userId } : cr
        );
      },
      speaker_removed: ({ userId, roomId, muteMap }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                muteMap,
                users: c.users.map((x) =>
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
      },
      speaker_added: ({ userId, roomId, muteMap }) => {
        // Mute user upon added as speaker
        if (meRef.current?.id === userId) {
          const { setMute } = useMuteStore.getState();
          wsend({
            op: "mute",
            d: { value: true },
          });
          setMute(true);
        }

        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                muteMap,
                users: c.users.map((x) =>
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
      },
      mod_changed: ({ userId, roomId }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                users: c.users.map((x) =>
                  userId === x.id
                    ? {
                        ...x,
                        roomPermissions: mergeRoomPermission(
                          x.roomPermissions,
                          { isMod: true }
                        ),
                      }
                    : x
                ),
              }
        );
      },
      user_left_room: ({ userId }) => {
        setCurrentRoom((cr) => {
          if (!cr) {
            return cr;
          }
          const { [userId]: _, ...asm } = cr.activeSpeakerMap;
          return {
            ...cr,
            activeSpeakerMap: asm,
            peoplePreviewList: cr.peoplePreviewList.filter(
              (x) => x.id !== userId
            ),
            numPeopleInside: cr.numPeopleInside - 1,
            users: cr.users.filter((x) => x.id !== userId),
          };
        });
      },
      new_user_join_room: ({ user, muteMap }) => {
        setCurrentRoom((cr) =>
          !cr || cr.users.some((u) => u.id === user.id)
            ? cr
            : {
                ...cr,
                muteMap,
                peoplePreviewList:
                  cr.peoplePreviewList.length < 10
                    ? [
                        ...cr.peoplePreviewList,
                        {
                          id: user.id,
                          displayName: user.displayName,
                          numFollowers: user.numFollowers,
                        },
                      ]
                    : cr.peoplePreviewList,
                numPeopleInside: cr.numPeopleInside + 1,
                users: [...cr.users.filter((x) => x.id !== user.id), user],
              }
        );
      },
      hand_raised: ({ roomId, userId }) => {
        setCurrentRoom((c) => {
          if (!c || c.id !== roomId) {
            return c;
          }
          return {
            ...c,
            users: c.users.map((u) =>
              u.id === userId
                ? {
                    ...u,
                    roomPermissions: mergeRoomPermission(u.roomPermissions, {
                      askedToSpeak: true,
                    }),
                  }
                : u
            ),
          };
        });
      },
      mute_changed: ({ userId, value, roomId }) => {
        setCurrentRoom((c) => {
          if (!c || c.id !== roomId) {
            return c;
          }
          if (value) {
            return {
              ...c,
              muteMap: { ...c.muteMap, [userId]: true },
            };
          } else {
            const { [userId]: _, ...newMm } = c.muteMap;
            return {
              ...c,
              muteMap: newMm,
            };
          }
        });
      },
      get_current_room_users_done: ({
        users,
        muteMap,
        roomId,
        activeSpeakerMap,
        autoSpeaker,
      }) => {
        setCurrentRoom((c) => {
          if (!c || c.id !== roomId) {
            return c;
          }
          return {
            ...c,
            activeSpeakerMap,
            users,
            muteMap,
            autoSpeaker,
          };
        });
      },
      new_current_room: ({ room }) => {
        if (room) {
          console.log("new room voice server id: " + room.voiceServerId);
          useRoomChatStore.getState().clearChat();
          wsend({ op: "get_current_room_users", d: {} });
          history.push("/room/" + room.id);
        }
        setCurrentRoom(() => roomToCurrentRoom(room));
      },
      initial_home_load_done: ({ me, publicRooms, nextCursor }) => {
        setMe(me);
        if (me.currentRoom) {
          setCurrentRoom(() => roomToCurrentRoom(me.currentRoom));
        }
        setPublicRooms(() => ({ publicRooms, nextCursor }));
      },
      join_room_done: (d) => {
        if (d.error) {
          if (window.location.pathname.startsWith("/room")) {
            history.push("/");
          }
          showErrorToast(d.error);
        } else if (d.room) {
          console.log("join with voice server id: " + d.room.voiceServerId);
          useRoomChatStore.getState().clearChat();
          setCurrentRoom(() => roomToCurrentRoom(d.room));
          wsend({ op: "get_current_room_users", d: {} });
        }
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/room/")) {
      let found = false;
      const parts = location.pathname.split("/");
      const id = parts.find((x) => {
        if (found) {
          return true;
        }
        if (x === "room") {
          found = true;
        }

        return false;
      });

      if (id && isUuid(id)) {
        wsend({ op: "join_room", d: { roomId: id } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/room/:id" component={RoomPage} />
      <Route exact path="/user" component={ViewUserPage} />
      <Route exact path="/me" component={MyProfilePage} />
      <Route exact path="/invite" component={InviteList} />
      <Route exact path="/search/users" component={SearchUsersPage} />
      <Route exact path="/ban/users" component={BanUsersPage} />
      <Route exact path="/voice-settings" component={VoiceSettingsPage} />
      <Route
        exact
        path="/sound-effect-settings"
        component={SoundEffectSettingsPage}
      />
      <Route exact path="/following-online" component={FollowingOnlineList} />
      <Route
        exact
        path={["/followers/:userId", "/following/:userId"]}
        component={FollowListPage}
      />
      <Route component={NotFoundPage} />
    </Switch>
  );
};
