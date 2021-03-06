defmodule Beef.Schemas.Notification do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.User

  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          type: String.t(),
          is_read: boolean(),
          user_id: Ecto.UUID.t(),
          notifier_id: Ecto.UUID.t(),
        }

  @derive {Poison.Encoder, only: ~w(id type user_id notifier_id)a}

  @primary_key {:id, :binary_id, []}
  schema "notifications" do
    field(:type, :string)
    field(:is_read, :boolean)

    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)
    belongs_to(:notifier, User, foreign_key: :notifier_id, type: :binary_id)

    timestamps()
  end

  @doc false
  def insert_changeset(notification, attrs) do
    notification
    |> cast(attrs, [:type, :user_id, :notifier_id])
    |> cast_assoc(:notifier)
  end
end
