defmodule Kousa.BL.User do
  # def search(query, cursor \\ nil) do
  #   Kousa.D
  # end

  def ban(user_id, username_to_ban, reason_for_ban) do
    user = Kousa.Data.User.get_by_id(user_id)

    if user.githubId == Application.get_env(:kousa, :ben_github_id, "") do
      user_to_ban = Kousa.Data.User.get_by_username(username_to_ban)

      if not is_nil(user_to_ban) do
        Kousa.BL.Room.leave_room(user_to_ban.id, user_to_ban.currentRoomId)
        Kousa.Data.User.set_reason_for_ban(user_to_ban.id, reason_for_ban)

        Kousa.Gen.UserSession.send_cast(
          user_to_ban.id,
          {:send_ws_msg, :web, %{op: "banned", d: %{}}}
        )

        true
      else
        IO.puts("tried to ban " <> username_to_ban <> " but that username didn't exist")
        false
      end
    else
      false
    end
  end

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
                  hasLoggedIn: false
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
