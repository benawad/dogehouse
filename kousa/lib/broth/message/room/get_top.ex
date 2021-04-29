defmodule Broth.Message.Room.GetTop do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:cursor, :integer, default: 0)
    field(:limit, :integer, default: 100)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:cursor, :limit])
    |> validate_number(:limit, greater_than: 0, message: "too low")
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:rooms, :nextCursor, :initial]}

    @primary_key false
    embedded_schema do
      embeds_many(:rooms, Beef.Schemas.Room)
      field(:nextCursor, :integer)
      field(:initial, :boolean)
    end
  end

  alias Beef.Rooms

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate),
         {rooms, nextCursor} <- Rooms.get_top_public_rooms(state.user.id, request.cursor) do
      {:reply, %Reply{rooms: rooms, nextCursor: nextCursor, initial: request.cursor == 0}, state}
    end
  end
end
