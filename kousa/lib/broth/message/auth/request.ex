defmodule Broth.Message.Auth.Request do
  use Broth.Message.Call,
    needs_auth: false

  @primary_key false
  embedded_schema do
    field(:accessToken, :string)
    field(:refreshToken, :string)
    field(:platform, :string)
    field(:currentRoomId, :binary_id)
    field(:reconnectToVoice, :boolean)
    field(:muted, :boolean, default: false)
    field(:deafened, :boolean, default: false)
  end

  alias Kousa.Utils.UUID

  @impl true
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:accessToken, :refreshToken, :platform, :reconnectToVoice, :muted, :deafened])
    |> validate_required([:accessToken])
    |> UUID.normalize(:currentRoomId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
      id
      username
      displayName
      avatarUrl
      bannerUrl
      bio
      online
      numFollowing
      numFollowers
      lastOnline
    )a}

    @primary_key {:id, :binary_id, []}
    schema "users" do
      field(:username, :string)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:bannerUrl, :string)
      field(:bio, :string, default: "")
      field(:currentRoomId, :binary_id)
      field(:numFollowing, :integer)
      field(:numFollowers, :integer)
      field(:online, :boolean)
      field(:lastOnline, :utc_datetime_usec)
    end
  end

  @impl true
  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate),
         {:ok, user} <- Kousa.Auth.authenticate(request, state.ip) do
      user_ids_i_am_blocking =
        user
        |> Beef.Repo.preload(:blocking)
        |> Map.get(:blocking)
        |> Enum.map(& &1.id)

      {:reply, user, %{state | user: user, user_ids_i_am_blocking: user_ids_i_am_blocking}}
    else
      # don't tolerate malformed requests with any response besides closing
      # out websocket.
      _ -> {:close, 4001, "invalid_authentication"}
    end
  end
end
