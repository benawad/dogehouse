defmodule Beef.ScheduledRooms do
  import Ecto.Query
  import Ecto.Changeset
  alias Kousa.Utils.Pagination
  alias Beef.Schemas.ScheduledRoom
  alias Beef.Repo

  @fetch_limit 16

  def get_by_id(id) do
    from(sr in ScheduledRoom,
      where: sr.id == ^id,
      inner_join: u in assoc(sr, :creator),
      preload: [
        creator: u
      ]
    )
    |> Repo.one()
  end

  def delete(user_id, id) do
    from(sr in ScheduledRoom, where: sr.creatorId == ^user_id and sr.id == ^id)
    |> Repo.delete_all()
  end

  def insert(data) do
    %ScheduledRoom{} |> ScheduledRoom.insert_changeset(data) |> Repo.insert(returning: true)
  end

  def room_started(user_id, id, room_id) do
    from(sr in ScheduledRoom,
      where: sr.creatorId == ^user_id and sr.id == ^id,
      update: [
        set: [
          roomId: ^room_id,
          started: true
        ]
      ]
    )
    |> Repo.update_all([])
  end

  @spec edit(
          any,
          any,
          :invalid | %{optional(:__struct__) => none, optional(atom | binary) => any}
        ) :: :ok | {:error, Ecto.Changeset.t()}
  def edit(user_id, id, data) do
    case ScheduledRoom.edit_changeset(%ScheduledRoom{}, data) |> apply_action(:update) do
      {:ok, cleaned_data} ->
        from(sr in ScheduledRoom,
          where: sr.creatorId == ^user_id and sr.id == ^id,
          update: [
            set: [
              name: ^cleaned_data.name,
              description: ^cleaned_data.description,
              scheduledFor: ^cleaned_data.scheduledFor
            ]
          ]
        )
        |> Repo.update_all([])

        :ok

      error ->
        error
    end
  end

  def add_cursor(q, "") do
    q
  end

  def add_cursor(q, nil) do
    q
  end

  def add_cursor(q, cursor) do
    with [iso, id] <- String.split(cursor, "|"),
         {:ok, dt} <- Timex.parse(iso, "{ISO:Basic:Z}") do
      where(q, [sr], {^dt, ^id} < {sr.scheduledFor, sr.id})
    else
      _ ->
        q
    end
  end

  def get_my_scheduled_rooms_about_to_start(user_id) do
    from(sr in ScheduledRoom,
      inner_join: u in assoc(sr, :creator),
      preload: [
        creator: u
      ],
      where:
        sr.creatorId == ^user_id and is_nil(sr.roomId) and
          sr.started ==
            false and
          fragment(
            "? - interval '1 hours' < now() and ? + interval '2 hours' > now()",
            sr.scheduledFor,
            sr.scheduledFor
          ),
      order_by: [asc: sr.scheduledFor],
      limit: ^@fetch_limit
    )
    |> Repo.all()
  end

  @spec get_feed(String.t(), boolean(), String.t()) :: {[ScheduledRoom], nil | number}
  def get_feed(user_id, get_only_my_scheduled_rooms, cursor) do
    q =
      from(sr in ScheduledRoom,
        inner_join: u in assoc(sr, :creator),
        order_by: [asc: sr.scheduledFor, asc: sr.id],
        where: sr.started == false,
        limit: ^@fetch_limit,
        preload: [
          creator: u
        ]
      )

    get_only_my_scheduled_rooms
    |> if(
      do:
        where(
          q,
          [sr],
          sr.creatorId == ^user_id and sr.scheduledFor > fragment("now() - interval '2 hours'")
        ),
      else: where(q, [sr], sr.scheduledFor > fragment("now()"))
    )
    |> add_cursor(cursor)
    |> Repo.all()
    |> Pagination.items_to_cursor_tuple(
      @fetch_limit,
      &(Timex.format!(&1.scheduledFor, "{ISO:Basic:Z}") <> "|" <> &1.id)
    )
  end

  @spec get_mine(String.t()) :: ScheduledRoom | nil
  def get_mine(user_id) do
    from(sr in ScheduledRoom,
      inner_join: u in assoc(sr, :creator),
      on: sr.creatorId == u.id,
      where: sr.scheduledFor > fragment("now()") and sr.creatorId == ^user_id,
      limit: 1,
      preload: [
        creator: u
      ]
    )
    |> Repo.one()
  end
end
