defmodule Beef.Access.Users do
  import Ecto.Query, warn: false

  alias Beef.Queries.Users, as: Query
  alias Beef.Repo
  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  alias Beef.Rooms

  def find_by_github_ids(ids) do
    Query.start
    |> Query.filter_by_github_ids(ids)
    |> Query.select_id
    |> Repo.all
  end

  def get_by_id(user_id) do
    Repo.get(User, user_id)
  end

  def get_by_username(username) do
    Query.start
    |> Query.filter_by_username(username)
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
      {:ok, current_room_id} ->
        {current_room_id,
         from(u in User,
           where: u.currentRoomId == ^current_room_id,
           left_join: rp in Beef.RoomPermission,
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
end
