defmodule Broth.Message.Auth.Request do
  use Ecto.Schema

  @primary_key false
  embedded_schema do
    field(:accessToken, :string)
    field(:refreshToken, :string)
    field(:platform, :string)
    field(:currentRoomId, :binary_id)
    field(:reconnectToVoice, :boolean)
    field(:muted, :boolean)
  end

  import Ecto.Changeset

  alias Kousa.Utils.UUID

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:accessToken, :refreshToken, :platform, :reconnectToVoice, :muted])
    |> validate_required([:accessToken])
    |> UUID.normalize(:currentRoomId)
  end

  defmodule Reply do
    use Ecto.Schema

    alias Beef.Schemas.User

    @derive {Jason.Encoder, only: [:user, :currentRoom]}

    Module.register_attribute(__MODULE__, :reply_operation, persist: true)
    @reply_operation "auth-good"

    @primary_key false
    embedded_schema do
      embeds_one(:user, User)
      field(:currentRoom, :binary_id)
    end
  end
end
