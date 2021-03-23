import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Route, Switch } from "react-router-dom";
import { auth_query, wsAuthFetch, wsend } from "../createWebsocket";
import { useCurrentRoomStore } from "../webrtc/stores/useCurrentRoomStore";
import { useMuteStore } from "../webrtc/stores/useMuteStore";
import { useSocketStatus } from "../webrtc/stores/useSocketStatus";
import { ScheduledRoomsPage } from "./modules/scheduled-rooms/ScheduledRoomsPage";
import { ViewScheduledRoomPage } from "./modules/scheduled-rooms/ViewScheduledRoomPage";
import { BanUsersPage } from "./pages/BanUsersPage";
import { FollowingOnlineList } from "./pages/FollowingOnlineList";
import { FollowListPage } from "./pages/FollowListPage";
import { Home } from "./pages/Home";
import { InviteList } from "./pages/InviteList";
import { Login } from "./pages/Login";
import { MyProfilePage } from "./pages/MyProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OverlaySettingsPage } from "./pages/OverlaySettingsPage";
import { RoomPage } from "./pages/RoomPage";
import { SearchUsersPage } from "./pages/SearchUsersPage";
import { SoundEffectSettingsPage } from "./pages/SoundEffectSettingsPage";
import { ViewUserPage } from "./pages/ViewUserPage";
import { VoiceSettingsPage } from "./pages/VoiceSettingsPage";
import { useMainWsHandler } from "./useMainWsHandler";
import { roomToCurrentRoom } from "./utils/roomToCurrentRoom";
import { useTokenStore } from "./utils/useTokenStore";
interface RoutesProps { }

export const Routes: React.FC<RoutesProps> = () => {
  const authIsGood = useSocketStatus((s) => s.status === "auth-good");
  const hasTokens = useTokenStore((s) => !!s.accessToken && !!s.refreshToken);
  useMainWsHandler();

  const { isLoading } = useQuery<any>(
    auth_query,
    () => {
      const { accessToken, refreshToken } = useTokenStore.getState();
      // I think this will probably only run in dev
      console.log(
        "AUTH_QUERY RUNNING, I HOPE YOU ARE NOT IN PROD LOL (nothing bad happens if you are, probably)"
      );
      return wsAuthFetch({
        op: auth_query,
        d: {
          accessToken,
          refreshToken,
          reconnectToVoice: false,
          currentRoomId: useCurrentRoomStore.getState().currentRoom?.id,
          muted: useMuteStore.getState().muted,
        },
      });
    },
    {
      onSuccess: (d) => {
        if (d?.currentRoom) {
          useCurrentRoomStore
            .getState()
            .setCurrentRoom(() => roomToCurrentRoom(d.currentRoom));
          wsend({ op: "get_current_room_users", d: {} });
        }
      },
      enabled: hasTokens && authIsGood,
      staleTime: Infinity,
    }
  );

  const [, , ready] = useTranslation();
  if (!ready || isLoading) {
    // this could become loading indicator
    return null;
  }

  return (
    <Switch>
      {/* PUBLIC ROUTES */}
      <Route
        exact
        path="/scheduled-room/:id"
        component={ViewScheduledRoomPage}
      />
      {/* PRIVATE ROUTES - login required */}
      <Route path="/">
        {!hasTokens ? (
          <Login />
        ) : (
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/scheduled-rooms"
              component={ScheduledRoomsPage}
            />
            <Route exact path="/room/:id" component={RoomPage} />
            <Route
              exact
              path={["/user", "/user/:username"]}
              component={ViewUserPage}
            />
            <Route exact path="/me" component={MyProfilePage} />
            <Route exact path="/invite" component={InviteList} />
            <Route exact path="/search/users" component={SearchUsersPage} />
            <Route exact path="/ban/users" component={BanUsersPage} />
            <Route exact path="/voice-settings" component={VoiceSettingsPage} />
            <Route exact path="/overlay-settings" component={OverlaySettingsPage} />
            <Route
              exact
              path="/sound-effect-settings"
              component={SoundEffectSettingsPage}
            />
            <Route
              exact
              path="/following-online"
              component={FollowingOnlineList}
            />
            <Route
              exact
              path={["/followers/:userId", "/following/:userId"]}
              component={FollowListPage}
            />
            <Route component={NotFoundPage} />
          </Switch>
        )}
      </Route>
    </Switch>
  );
};
