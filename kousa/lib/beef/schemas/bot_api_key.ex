defmodule Beef.Schemas.BotApiKey do
  use Ecto.Schema
  import Ecto.Changeset
  @timestamps_opts [type: :utc_datetime_usec]

  alias Beef.Schemas.User

  @type t :: %__MODULE__{
          ownerId: Ecto.UUID.t(),
          botId: Ecto.UUID.t(),
          apiKey: Ecto.UUID.t()
        }

  @derive {Poison.Encoder, only: [:ownerId, :botId, :apiKey]}
  @primary_key false
  schema "bot_api_keys" do
    belongs_to(:owner, User, foreign_key: :ownerId, type: :binary_id)
    belongs_to(:bot, User, foreign_key: :botId, type: :binary_id)
    field(:apiKey, :binary_id)

    timestamps()
  end

  @doc false
  def insert_changeset(bot_api_key, attrs, bot) do
    bot_api_key
    |> cast(attrs, [:ownerId, :botId, :apiKey])
    |> put_assoc(:bot, bot)
  end
end
