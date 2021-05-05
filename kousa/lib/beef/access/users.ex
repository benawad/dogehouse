defmodule Beef.Access.Users do
  import Ecto.Query, warn: false

  alias Beef.Queries.Users, as: Query
  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Beef.Rooms

  def get(user_id) do
    Repo.get(User, user_id)
  end

  def get(user_id, opts) do
    # opts could be a preload.
  end

  def find_by_github_ids(ids) do
    Query.start()
    |> Query.filter_by_github_ids(ids)
    |> Query.select_id()
    |> Repo.all()
  end

  def search_username(<<first_letter>> <> rest) when first_letter == ?@ do
    search_username(rest)
  end

  def search_username(start_of_username) do
    search_str = start_of_username <> "%"

    Query.start()
    # here
    |> where([u], ilike(u.username, ^search_str))
    |> order_by([u], desc: u.numFollowers)
    |> limit([], 15)
    |> Repo.all()
  end

  @spec get_by_id_with_follow_info(any, any) :: any
  def get_by_id_with_follow_info(me_id, them_id) do
    Query.start()
    |> Query.filter_by_id(them_id)
    |> select([u], u)
    |> Query.follow_info(me_id)
    |> Query.i_blocked_them_info(me_id)
    |> Query.they_blocked_me_info(me_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  def get_by_id(user_id) do
    Repo.get(User, user_id)
  end

  def get_by_id_with_room_permissions(user_id) do
    from(u in User,
      where: u.id == ^user_id,
      left_join: rp in Beef.Schemas.RoomPermission,
      on: rp.userId == u.id and rp.roomId == u.currentRoomId,
      select: %{u | roomPermissions: rp},
      limit: 1
    )
    |> Repo.one()
  end

  def get_by_username(username) do
    Query.start()
    |> Query.filter_by_username(username)
    |> Repo.one()
  end

  def get_by_username_with_follow_info(user_id, username) do
    Query.start()
    |> Query.filter_by_username(username)
    |> select([u], u)
    |> Query.follow_info(user_id)
    |> Query.i_blocked_them_info(user_id)
    |> Query.they_blocked_me_info(user_id)
    |> Query.limit_one()
    |> Repo.one()
  end

  @fetch_limit 16
  def search(query, offset) do
    query_with_percent = "%" <> query <> "%"

    items =
      from(u in User,
        where:
          ilike(u.username, ^query_with_percent) or
            ilike(u.displayName, ^query_with_percent),
        left_join: cr in Room,
        on: u.currentRoomId == cr.id and cr.isPrivate == false,
        select: %{u | currentRoom: cr},
        limit: @fetch_limit,
        offset: ^offset
      )
      |> Repo.all()

    {Enum.slice(items, 0, -1 + @fetch_limit),
     if(length(items) == @fetch_limit, do: -1 + offset + @fetch_limit, else: nil)}
  end

  def get_users_in_current_room(user_id) do
    case tuple_get_current_room_id(user_id) do
      {:ok, nil} ->
        {nil, []}

      {:ok, current_room_id} ->
        {current_room_id,
         from(u in User,
           where: u.currentRoomId == ^current_room_id,
           left_join: rp in Beef.Schemas.RoomPermission,
           on: rp.userId == u.id and rp.roomId == u.currentRoomId,
           select: %{u | roomPermissions: rp}
         )
         |> Repo.all()}

      _ ->
        {nil, []}
    end
  end

  # NB: Anything that touches Gen will have to be refactored away
  # out of the database layer, but we are keeping it here for now
  # to keep the transition smooth.
  def tuple_get_current_room_id(user_id) do
    # DO NOT COPY/PASTE THIS FUNCTION
    case Onion.UserSession.get_current_room_id(user_id) do
      {:ok, nil} ->
        {nil, nil}

      x ->
        {:ok, x}
    end
  end

  @spec get_by_id_with_current_room(any) :: any
  def get_by_id_with_current_room(user_id) do
    from(u in User,
      left_join: a0 in assoc(u, :currentRoom),
      where: u.id == ^user_id,
      limit: 1,
      preload: [
        currentRoom: a0
      ]
    )
    |> Repo.one()
  end

  def get_current_room(user_id) do
    room_id = get_current_room_id(user_id)

    case room_id do
      nil -> nil
      id -> Rooms.get_room_by_id(id)
    end
  end

  def get_current_room_id(user_id) do
    # DO NOT COPY/PASTE THIS FUNCTION
    try do
      Onion.UserSession.get_current_room_id(user_id)
    catch
      _, _ ->
        case get_by_id(user_id) do
          nil -> nil
          %{currentRoomId: id} -> id
        end
    end
  end

  def get_ip(user_id) do
    # DO NOT COPY/PASTE THIS FUNCTION
    try do
      Onion.UserSession.get(user_id, :ip)
    catch
      _, _ ->
        case get_by_id(user_id) do
          nil -> nil
          %{ip: ip} -> ip
        end
    end
  end

  def bot?(user_id) do
    # DO NOT COPY/PASTE THIS FUNCTION
    try do
      not is_nil(Onion.UserSession.get(user_id, :bot_owner_id))
    catch
      _, _ ->
        case get_by_id(user_id) do
          nil -> nil
          %{botOwnerId: botOwnerId} -> not is_nil(botOwnerId)
        end
    end
  end

  def get_by_api_key(api_key) do
    Repo.get_by(User, apiKey: api_key)
  end

  def count_bot_accounts(user_id) do
    Repo.one(from(u in User, select: fragment("count(*)"), where: u.botOwnerId == ^user_id))
  end
end
