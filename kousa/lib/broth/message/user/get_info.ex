defmodule Broth.Message.User.GetInfo do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:userIdOrUsername, :string)
  end

  # userId is either a uuid or username
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userIdOrUsername])
    |> validate_required([:userIdOrUsername])
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
      iBlockedThem
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
      field(:youAreFollowing, :boolean, virtual: true)
      field(:followsYou, :boolean, virtual: true)
      field(:iBlockedThem, :boolean, virtual: true)
      field(:error, :string, virtual: true)
    end
  end

  alias Beef.Users

  def execute(changeset, state) do
    case apply_action(changeset, :validate) do
      {:ok, %{userIdOrUsername: userIdOrUsername}} ->
        user =
          case Ecto.UUID.cast(userIdOrUsername) do
            {:ok, _} ->
              Users.get_by_id_with_follow_info(state.user.id, userIdOrUsername)

            _ ->
              Users.get_by_username_with_follow_info(state.user.id, userIdOrUsername)
          end

        case user do
          nil ->
            {:reply, %{error: "could not find user"}, state}

          %{theyBlockedMe: true} ->
            {:reply, %{error: "blocked"}, state}

          _ ->
            {:reply, user, state}
        end

      error ->
        error
    end
  end
end
