defmodule Beef.Schemas.ScheduledRoomCohost do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.User
  alias Beef.Schemas.ScheduledRoom
  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          userId: Ecto.UUID.t(),
          scheduledRoomId: Ecto.UUID.t()
        }

  @primary_key false
  schema "scheduled_room_cohosts" do
    belongs_to(:user, User, foreign_key: :userId, type: :binary_id)
    belongs_to(:scheduledRoom, ScheduledRoom, foreign_key: :scheduledRoomId, type: :binary_id)

    timestamps()
  end

  @doc false
  def insert_changeset(follow, attrs) do
    follow
    |> cast(attrs, [:userId, :scheduledRoomId])
    |> validate_required([:userId, :scheduledRoomId])
    |> unique_constraint(:already_cohost, name: "scheduled_room_cohosts_pkey")
  end
end
