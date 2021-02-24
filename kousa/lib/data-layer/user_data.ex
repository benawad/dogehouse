defmodule Kousa.Data.User do
  import Ecto.Query, warn: false
  alias Beef.{Repo, User}

  @fetch_limit 16
  def edit_profile(user_id, data) do
    %User{id: user_id}
    |> User.edit_changeset(data)
    |> Repo.update()
  end

  def search(query, offset) do
    query_with_percent = "%" <> query <> "%"

    items =
      from(u in Beef.User,
        where:
          ilike(u.username, ^query_with_percent) or
            ilike(u.displayName, ^query_with_percent),
        left_join: cr in Beef.Room,
        on: u.currentRoomId == cr.id and cr.isPrivate == false,
        select: %{u | currentRoom: cr},
        limit: @fetch_limit,
        offset: ^offset
      )
      |> Beef.Repo.all()

    {Enum.slice(items, 0, -1 + @fetch_limit),
     if(length(items) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  def bulk_insert(users) do
    Beef.Repo.insert_all(
      Beef.User,
      users,
      on_conflict: :nothing
    )
  end

  def find_by_github_ids(ids) do
    from(u in Beef.User, where: u.githubId in ^ids, select: u.id)
    |> Beef.Repo.all()
  end

  def inc_num_following(user_id, n) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        inc: [
          numFollowing: ^n
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def get_users_in_current_room(user_id) do
    case tuple_get_current_room_id(user_id) do
      {:ok, current_room_id} ->
        {current_room_id,
         from(u in Beef.User,
           where: u.currentRoomId == ^current_room_id,
           left_join: rp in Beef.RoomPermission,
           on: rp.userId == u.id and rp.roomId == u.currentRoomId,
           select: %{u | roomPermissions: rp}
         )
         |> Beef.Repo.all()}

      _ ->
        {nil, []}
    end
  end

  def get_by_id(user_id) do
    Beef.Repo.get(Beef.User, user_id)
  end

  def get_by_username(username) do
    from(u in Beef.User,
      where: u.username == ^username,
      limit: 1
    )
    |> Beef.Repo.one()
  end

  def set_reason_for_ban(user_id, reason_for_ban) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          reasonForBan: ^reason_for_ban
        ]
      ]
    )
    |> Repo.update_all([])
  end

  @spec get_by_id_with_current_room(any) :: any
  def get_by_id_with_current_room(user_id) do
    from(u in Beef.User,
      left_join: a0 in assoc(u, :currentRoom),
      where: u.id == ^user_id,
      limit: 1,
      preload: [
        currentRoom: a0
      ]
    )
    |> Beef.Repo.one()
  end

  def set_online(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          online: true
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_user_left_current_room(user_id) do
    Kousa.RegUtils.lookup_and_cast(Kousa.Gen.UserSession, user_id, {:set_current_room_id, nil})

    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          currentRoomId: nil
        ]
      ]
    )
    |> Repo.update_all([])
  end

  def set_offline(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      update: [
        set: [
          online: false,
          lastOnline: fragment("now()")
        ]
      ]
      # select: u
    )
    |> Repo.update_all([])
  end

  def get_current_room(user_id) do
    room_id = get_current_room_id(user_id)

    case room_id do
      nil -> nil
      id -> Kousa.Data.Room.get_room_by_id(id)
    end
  end

  def tuple_get_current_room_id(user_id) do
    case Kousa.RegUtils.lookup_and_call(
           Kousa.Gen.UserSession,
           user_id,
           {:get_current_room_id}
         ) do
      {:ok, nil} ->
        {nil, nil}

      x ->
        x
    end
  end

  def get_current_room_id(user_id) do
    case Kousa.RegUtils.lookup_and_call(
           Kousa.Gen.UserSession,
           user_id,
           {:get_current_room_id}
         ) do
      {:ok, id} ->
        id

      _ ->
        nil
    end
  end

  def set_current_room(user_id, room_id, can_speak \\ false, returning \\ false) do
    roomPermissions =
      case can_speak do
        true ->
          case Kousa.Data.RoomPermission.set_is_speaker(user_id, room_id, true, true) do
            {:ok, x} -> x
            _ -> nil
          end

        _ ->
          Kousa.Data.RoomPermission.get(user_id, room_id)
      end

    Kousa.RegUtils.lookup_and_cast(
      Kousa.Gen.UserSession,
      user_id,
      {:set_current_room_id, room_id}
    )

    q =
      from(u in Beef.User,
        where: u.id == ^user_id,
        update: [
          set: [
            currentRoomId: ^room_id
          ]
        ]
      )

    q = if returning, do: select(q, [u], u), else: q

    case q
         |> Beef.Repo.update_all([]) do
      {_, [user]} -> %{user | roomPermissions: roomPermissions}
      _ -> nil
    end
  end

  def twitter_find_or_create(user) do
    db_user =
      from(u in Beef.User,
        where:
          (not is_nil(u.email) and u.email == ^user.email and u.email != "") or
            u.twitterId == ^user.twitterId,
        limit: 1
      )
      |> Repo.one()

    cond do
      db_user ->
        if is_nil(db_user.twitterId) do
          from(u in Beef.User,
            where: u.id == ^db_user.id,
            update: [
              set: [
                twitterId: ^user.twitterId
              ]
            ]
          )
          |> Repo.update_all([])
        end

        {:find, db_user}

      true ->
        {:create,
         Repo.insert!(
           %User{
             username: Kousa.Random.big_ascii_id(),
             email: if(user.email == "", do: nil, else: user.email),
             twitterId: user.twitterId,
             avatarUrl: user.avatarUrl,
             displayName:
               if(is_nil(user.displayName) or String.trim(user.displayName) == "",
                 do: "Novice Doge",
                 else: user.displayName
               ),
             bio: user.bio,
             hasLoggedIn: true
           },
           returning: true
         )}
    end
  end

  def github_find_or_create(user, github_access_token) do
    githubId = Integer.to_string(user["id"])

    db_user =
      from(u in Beef.User,
        where:
          u.githubId == ^githubId or
            (not is_nil(u.email) and u.email != "" and u.email == ^user["email"]),
        limit: 1
      )
      |> Repo.one()

    cond do
      db_user ->
        if is_nil(db_user.githubId) do
          from(u in Beef.User,
            where: u.id == ^db_user.id,
            update: [
              set: [
                githubId: ^githubId,
                githubAccessToken: ^github_access_token
              ]
            ]
          )
          |> Repo.update_all([])
        end

        {:find, db_user}

      true ->
        {:create,
         Repo.insert!(
           %User{
             username: Kousa.Random.big_ascii_id(),
             githubId: githubId,
             email: if(user["email"] == "", do: nil, else: user["email"]),
             githubAccessToken: github_access_token,
             avatarUrl: user["avatar_url"],
             displayName:
               if(is_nil(user["name"]) or String.trim(user["name"]) == "",
                 do: "Novice Doge",
                 else: user["name"]
               ),
             bio: user["bio"],
             hasLoggedIn: true
           },
           returning: true
         )}
    end
  end
end
