defmodule Beef.RoomPermission do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Poison.Encoder, only: [:isSpeaker, :isMod, :askedToSpeak]}
  @primary_key false
  schema "room_permissions" do
    belongs_to(:user, Beef.User, foreign_key: :userId, type: :binary_id)
    belongs_to(:room, Beef.Room, foreign_key: :roomId, type: :binary_id)
    field(:isSpeaker, :boolean)
    field(:isMod, :boolean)
    field(:askedToSpeak, :boolean)

    timestamps()
  end

  @doc false
  def insert_changeset(roomPerm, attrs) do
    roomPerm
    |> cast(attrs, [:userId, :roomId, :isSpeaker, :isMod, :askedToSpeak])
    |> validate_required([:userId, :roomId])
  end
end
