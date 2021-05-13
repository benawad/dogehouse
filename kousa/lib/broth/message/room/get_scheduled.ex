defmodule Broth.Message.Room.GetScheduled do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # TO BE CHANGED TO UTC_DATETIME, WHERE A DT IN THE PAST IS HISTORICAL
    # A DT IN THE FUTURE IS LIMIT, and nil is all
    field(:range, :string, default: "all")
    field(:userId, :binary_id)
    field(:cursor, :integer)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:range, :userId, :cursor])
    |> validate_inclusion(:range, ["all", "upcoming"])

    # to be made explicit in the future, currently we need "user"
    # hack to get this to work.
    #    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:rooms, :nextCursor]}

    embedded_schema do
      # TO BE CHANGED TO DISPLAYROOM.
      field(:rooms, {:array, :map})
      field(:nextCursor, :integer)
    end
  end

  def execute(changeset, state = %{user: %{id: user_id}}) do
    with {:ok, request} <- apply_action(changeset, :validate) do
      case request do
        %{userId: nil, range: "all"} ->
          {rooms, next_cursor} =
            Kousa.ScheduledRoom.get_scheduled_rooms(
              user_id,
              false,
              request.cursor
            )

          {:reply, %Reply{rooms: rooms, nextCursor: next_cursor}, state}

        %{userId: u, range: "all"} when u == "self" or u == user_id ->
          {rooms, next_cursor} =
            Kousa.ScheduledRoom.get_scheduled_rooms(
              user_id,
              true,
              request.cursor
            )

          {:reply, %Reply{rooms: rooms, nextCursor: next_cursor}, state}

        %{userId: u, range: "all"} when u != "self" ->
          {rooms, next_cursor} =
            Kousa.ScheduledRoom.get_scheduled_rooms(
              u,
              true,
              request.cursor
            )

          {:reply, %Reply{rooms: rooms, nextCursor: next_cursor}, state}

        %{userId: u, range: "upcoming"} when u == "self" or u == user_id ->
          rooms = Kousa.ScheduledRoom.get_my_scheduled_rooms_about_to_start(user_id)
          {:reply, %Reply{rooms: rooms}, state}

        _ ->
          {:error, "not supported yet"}
      end
    end
  end
end
