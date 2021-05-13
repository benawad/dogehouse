defmodule Beef.Schemas.RoomPermission do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.Room

  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          roomId: Ecto.UUID.t(),
          userId: Ecto.UUID.t(),
          isSpeaker: boolean(),
          isMod: boolean(),
          askedToSpeak: boolean()
        }

  alias Beef.Schemas.User

  @derive {Jason.Encoder, only: [:isSpeaker, :isMod, :askedToSpeak]}
  @primary_key false
  schema "room_permissions" do
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)
    belongs_to(:room, Room, foreign_key: :roomId, type: :binary_id)
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
