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
    alias Beef.Repo

    @derive {Jason.Encoder, only: ~w(
      id
      username
      displayName
      avatarUrl
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
    case apply_action(changeset, :validate) do
      {:ok, request} -> convert_tokens(request, state)
      error -> error
    end
  end

  alias Beef.Repo
  alias Onion.PubSub

  defp convert_tokens(request, state) do
    alias Kousa.Utils.TokenUtils

    case TokenUtils.tokens_to_user_id(request.accessToken, request.refreshToken) do
      nil ->
        {:close, 4001, "invalid_authentication"}

      {:existing_claim, user_id} ->
        do_auth(user_id, nil, Repo.get(Reply, user_id), request, state)

      {:new_tokens, user_id, tokens, user} ->
        do_auth(user_id, tokens, user, request, state)
    end
  end

  defp do_auth(user_id, tokens, user, request, state) do
    alias Onion.UserSession
    alias Onion.RoomSession
    alias Beef.Rooms
    alias Beef.Repo

    if user do
      # note that this will start the session and will be ignored if the
      # session is already running.
      UserSession.start_supervised(
        user_id: user_id,
        username: user.username,
        avatar_url: user.avatarUrl,
        display_name: user.displayName,
        current_room_id: user.currentRoomId,
        muted: request.muted,
        deafened: request.deafened
      )

      # currently we only allow one active websocket connection per-user
      # at some point soon we're going to make this multi-connection, and we
      # won't have to do this.
      UserSession.set_active_ws(user_id, self())

      if tokens do
        UserSession.new_tokens(user_id, tokens)
      end

      roomIdFromFrontend = request.currentRoomId

      cond do
        user.currentRoomId ->
          # TODO: move toroom business logic
          room = Rooms.get_room_by_id(user.currentRoomId)

          RoomSession.start_supervised(
            room_id: user.currentRoomId,
            voice_server_id: room.voiceServerId
          )

          RoomSession.join_room(room.id, user.id, request.muted, request.deafened)

          if request.reconnectToVoice == true do
            Kousa.Room.join_vc_room(user.id, room)
          end

        roomIdFromFrontend ->
          Kousa.Room.join_room(user.id, roomIdFromFrontend)

        true ->
          :ok
      end

      # subscribe to chats directed to oneself.
      PubSub.subscribe("chat:" <> user_id)

      {:reply, Repo.get(Reply, user_id), %{state | user_id: user_id, awaiting_init: false}}
    else
      {:close, 4001, "invalid authentication"}
    end
  end
end
