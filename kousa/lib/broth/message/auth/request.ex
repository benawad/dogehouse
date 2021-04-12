defmodule Broth.Message.Auth.Request do
  use Broth.Message

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

  @impl true
  def changeset(data, _state) do
    %__MODULE__{}
    |> cast(data, [:accessToken, :refreshToken, :platform, :reconnectToVoice, :muted])
    |> validate_required([:accessToken])
    |> UUID.normalize(:currentRoomId)
  end

  defmodule Reply do
    alias Beef.Repo
    use Broth.Message

    @derive {Jason.Encoder, only: ~w(
      id
      username
      displayName
      avatarUrl
      bio
    )a}

    @primary_key {:id, :binary_id, []}
    schema "users" do
      field(:username, :string)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:bio, :string, default: "")

      embed_error()
    end

    def tag, do: "auth:request:reply"

    @impl true
    def changeset(original_message, %{id: id}) do
      original_message
      |> change
      |> put_change(:payload, Repo.get(__MODULE__, id) )
    end
  end
end
