defmodule Kousa.BL.User do
  # def search(query, cursor \\ nil) do
  #   Kousa.D
  # end

  def load_followers(access_token, user_id, cursor \\ nil, n \\ 0) do
    if n < 10 do
      case Kousa.Github.get_followers(access_token, cursor) do
        {:ok,
         %{"data" => %{"viewer" => %{"following" => %{"nodes" => nodes, "pageInfo" => pageInfo}}}}} ->
          if length(nodes) > 0 do
            Kousa.Data.User.bulk_insert(
              Enum.map(nodes, fn user ->
                %{
                  username: user["login"],
                  githubId: Integer.to_string(user["databaseId"]),
                  avatarUrl: user["avatarUrl"],
                  displayName: if(user["name"] == "", do: user["login"], else: user["name"]),
                  bio: user["bio"],
                  hasLoggedIn: true
                }
              end)
            )

            ids =
              Kousa.Data.User.find_by_github_ids(
                Enum.map(nodes, &Integer.to_string(&1["databaseId"]))
              )

            {new_followers, _} =
              Kousa.Data.Follower.bulk_insert(Enum.map(ids, &%{userId: &1, followerId: user_id}))

            Kousa.Data.User.inc_num_following(user_id, new_followers)

            if pageInfo["hasNextPage"] do
              load_followers(access_token, user_id, pageInfo["endCursor"], n + 1)
            end
          end

        _ ->
          nil
      end
    end
  end
end
