import React from "react";
import { Route, Switch } from "react-router-dom";
import { ScheduledRoomsPage } from "./modules/scheduled-rooms/ScheduledRoomsPage";
import { BanUsersPage } from "./pages/BanUsersPage";
import { FollowingOnlineList } from "./pages/FollowingOnlineList";
import { FollowListPage } from "./pages/FollowListPage";
import { Home } from "./pages/Home";
import { InviteList } from "./pages/InviteList";
import { MyProfilePage } from "./pages/MyProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RoomPage } from "./pages/RoomPage";
import { SearchUsersPage } from "./pages/SearchUsersPage";
import { SoundEffectSettingsPage } from "./pages/SoundEffectSettingsPage";
import { ViewUserPage } from "./pages/ViewUserPage";
import { VoiceSettingsPage } from "./pages/VoiceSettingsPage";
import { useMainWsHandler } from "./useMainWsHandler";
interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = () => {
	useMainWsHandler();
	return (
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/scheduled-rooms" component={ScheduledRoomsPage} />
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
