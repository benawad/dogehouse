import React from "react";
import { useHistory } from "react-router-dom";
import { useMeQuery } from "../utils/useMeQuery";
import { Avatar } from "./Avatar";

interface ProfileButtonProps {
	size?: number;
	circle?: boolean;
	padding?: boolean;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({
	size = 41,
	circle,
	padding = true
}) => {
	const { me } = useMeQuery();
	const history = useHistory();
	return me ? (
		<button onClick={() => history.push("/me")} className={padding ? `px-2.5` : ``}>
			<Avatar circle={circle} size={size} src={me.avatarUrl} />
		</button>
	) : null;
};
