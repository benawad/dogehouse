defmodule Beef.Schemas.Notification do
  use Ecto.Schema
  import Ecto.Changeset
  alias Beef.Schemas.User

  @timestamps_opts [type: :utc_datetime_usec]

  @type t :: %__MODULE__{
          id: Ecto.UUID.t(),
          type: String.t(),
          message: String.t(),
          user_id: Ecto.UUID.t(),
          notifier_id: Ecto.UUID.t(),
        }

  @derive {Poison.Encoder, only: ~w(id type message user_id notifier_id)a}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:type, :string)
    field(:message, :string)

    belongs_to(:user, User, foreign_key: :user_id, type: :binary_id)
    belongs_to(:notifier, User, foreign_key: :notifier_id, type: :binary_id)

    timestamps()
  end

  @doc false
  def changeset(notification, _attrs) do
    notification
    |> validate_required([:type, :message, :user_id])
  end
end
