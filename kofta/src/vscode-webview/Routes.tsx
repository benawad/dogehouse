import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { closeWebSocket, wsend } from "../createWebsocket";
import { useWsHandlerStore } from "../webrtc/stores/useWsHandlerStore";
import { invitationToRoom } from "../webrtc/utils/invitationToRoom";
import {
  setCurrentRoomAtom,
  setFollowerMapAtom,
  setFollowingMapAtom,
  setFollowingOnlineAtom,
  setInviteListAtom,
  setMeAtom,
  setPublicRoomsAtom,
} from "./atoms";
import { useRoomChatStore } from "./modules/room-chat/useRoomChatStore";
import { BanUsersPage } from "./pages/BanUsersPage";
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

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const addMultipleWsListener = useWsHandlerStore(
    (s) => s.addMultipleWsListener
  );
  const [, setCurrentRoom] = useAtom(setCurrentRoomAtom);
  const [, setMe] = useAtom(setMeAtom);
  const [, setPublicRooms] = useAtom(setPublicRoomsAtom);
  const [, setFollowerMap] = useAtom(setFollowerMapAtom);
  const [, setFollowingMap] = useAtom(setFollowingMapAtom);
  const [, setFollowingOnline] = useAtom(setFollowingOnlineAtom);
  const [, setInviteList] = useAtom(setInviteListAtom);
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
        useRoomChatStore.getState().addMessage(msg);
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
      invitation_to_room: (value) => {
        invitationToRoom(value, history);
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
      speaker_removed: ({ userId, roomId, muteMap, raiseHandMap }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                muteMap,
                raiseHandMap,
                users: c.users.map((x) =>
                  userId === x.id ? { ...x, canSpeakForRoomId: null } : x
                ),
              }
        );
      },
      speaker_added: ({ userId, roomId, muteMap }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                muteMap,
                users: c.users.map((x) =>
                  userId === x.id ? { ...x, canSpeakForRoomId: roomId } : x
                ),
              }
        );
      },
      mod_changed: ({ modForRoomId, userId, roomId }) => {
        setCurrentRoom((c) =>
          !c || c.id !== roomId
            ? c
            : {
                ...c,
                users: c.users.map((x) =>
                  userId === x.id ? { ...x, modForRoomId } : x
                ),
              }
        );
      },
      user_left_room: ({ userId }) => {
        setCurrentRoom((cr) => {
          return !cr
            ? null
            : {
                ...cr,
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
                users: [...cr.users, user],
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
            raiseHandMap: {
              ...c.raiseHandMap,
              [userId]: -1,
            },
          };
        });
      },
      mute_changed: ({ userId, value, roomId }) => {
        setCurrentRoom((c) => {
          if (!c || c.id !== roomId) {
            return c;
          }
          if (value) {
            return { ...c, muteMap: { ...c.muteMap, [userId]: true } };
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
        raiseHandMap,
        roomId,
        autoSpeaker,
      }) => {
        setCurrentRoom((c) => {
          if (!c || c.id !== roomId) {
            return c;
          }
          return {
            ...c,
            users,
            muteMap,
            raiseHandMap,
            autoSpeaker,
          };
        });
      },
      new_current_room: ({ room }) => {
        if (room) {
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
        } else {
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
