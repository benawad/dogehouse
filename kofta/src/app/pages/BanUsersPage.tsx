import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { wsend } from "../../createWebsocket";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { Button } from "../components/Button";
import { Wrapper } from "../components/Wrapper";
import { useMeQuery } from "../utils/useMeQuery";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

interface SearchUsersProps {}

export const BanUsersPage: React.FC<SearchUsersProps> = ({}) => {
	const { me } = useMeQuery();
	const [username, setUsername] = useState("");
	const [reason, setReason] = useState("");
	const { t } = useTypeSafeTranslation();

	if (!me) {
		return null;
	}

	if (me.username !== "benawad") {
		return <Redirect to="/" />;
	}

	return (
		<Wrapper>
			<Backbar />
			<BodyWrapper>
				<input
					className={`mb-8`}
					autoFocus
					placeholder="username to ban..."
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					className={`mb-16`}
					autoFocus
					placeholder="reason"
					value={reason}
					onChange={(e) => setReason(e.target.value)}
				/>
				<Button
					onClick={() => {
						if (username && reason) {
							wsend({
								op: "ban",
								d: {
									username,
									reason,
								},
							});
						}
					}}
				>
					{t("pages.banUser.ban")}
				</Button>
			</BodyWrapper>
		</Wrapper>
	);
};
