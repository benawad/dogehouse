defmodule Broth.Message.Auth.Request do
  use Broth.Message.Call

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
    use Broth.Message.Push
    alias Beef.Repo

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

  def execute(request = %{accessToken: accessToken, refreshToken: refreshToken}, state) do
    case Kousa.Utils.TokenUtils.tokens_to_user_id(accessToken, refreshToken) do
      nil ->
        {:close, 4001, "invalid_authentication"}

      {:existing_claim, user_id} ->
        do_auth(user_id, nil, Beef.Users.get_by_id(user_id), request, state)

      {:new_tokens, user_id, tokens, user} ->
        do_auth(user_id, tokens, user, request, state)
    end
  end

  defp do_auth(user_id, tokens, user, request, state) do
    if user do
      # note that this will start the session and will be ignored if the
      # session is already running.
      UserSession.start_supervised(
        user_id: user_id,
        username: user.username,
        avatar_url: user.avatarUrl,
        display_name: user.displayName,
        current_room_id: user.currentRoomId,
        muted: request.muted
      )

      UserSession.set_pid(user_id, self())

      if tokens do
        UserSession.new_tokens(user_id, tokens)
      end

      roomIdFromFrontend = request.currentRoomId

      cond do
        user.currentRoomId ->
          # TODO: move toroom business logic
          room = Rooms.get_room_by_id(user.currentRoomId)

          Onion.RoomSession.start_supervised(
            room_id: user.currentRoomId,
            voice_server_id: room.voiceServerId
          )

          Onion.RoomSession.join_room(room.id, user, request.muted)

          if request.reconnectToVoice == true do
            Kousa.Room.join_vc_room(user.id, room)
          end

        roomIdFromFrontend ->
          Kousa.Room.join_room(user.id, roomIdFromFrontend)

        true -> :ok
      end

      {:reply,
        %{id: user_id},
        %{state | user_id: user_id, awaiting_init: false}}
    else
      {:close, 4001, "invalid authentication"}
    end
  end
end
