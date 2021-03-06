defmodule Beef.RoomBlock do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.User
  alias Beef.Schemas.Room
  @timestamps_opts [type: :utc_datetime_usec]

  @derive {Poison.Encoder, only: [:userId, :roomId, :modId]}
  @primary_key false
  schema "room_blocks" do
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)
    belongs_to(:room, Room, foreign_key: :roomId, type: :binary_id)
    belongs_to(:mod, User, foreign_key: :modId, type: :binary_id)

    timestamps()
  end

  @doc false
  def insert_changeset(roomBlock, attrs) do
    roomBlock
    |> cast(attrs, [:userId, :roomId, :modId])
    |> validate_required([:userId, :roomId, :modId])
  end
end
