import { useQuery } from "react-query";
import { auth_query } from "../../createWebsocket";
import { BaseUser } from "../types";

export const useMeQuery = () => {
	const { data, isLoading } = useQuery<{ user: BaseUser }>(auth_query, {
		enabled: false,
	});

	return { me: data?.user, isLoading };
};
