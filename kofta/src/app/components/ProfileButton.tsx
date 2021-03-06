import React from "react";
import { useHistory } from "react-router-dom";
import { useMeQuery } from "../utils/useMeQuery";
import { Avatar } from "./Avatar";

interface ProfileButtonProps {
	size?: number;
	circle?: boolean;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
	size = 41,
	circle,
}) => {
	const { me } = useMeQuery();
	const history = useHistory();
	return me ? (
		<button onClick={() => history.push("/me")} className={`px-2.5`}>
			<Avatar circle={circle} size={size} src={me.avatarUrl} />
		</button>
	) : null;
};
