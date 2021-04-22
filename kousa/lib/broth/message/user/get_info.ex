defmodule Broth.Message.User.GetInfo do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:userId, :binary_id)
  end

  def initialize(state) do
    %__MODULE__{userId: state.user_id}
  end

  # userId is either a uuid or username
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  defmodule Reply do
    use Broth.Message.Push

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
      field(:youAreFollowing, :boolean, virtual: true)
      field(:followsYou, :boolean, virtual: true)
    end
  end

  alias Beef.Users

  def execute(changeset, state) do
    case apply_action(changeset, :validate) do
      {:ok, %{userId: user_id}} ->
        case Ecto.UUID.cast(user_id) do
          {:ok, _} ->
            {:reply, Users.get_by_id_with_follow_info(state.user_id, user_id), state}

          _ ->
            {:reply, Users.get_by_username_with_follow_info(state.user_id, user_id), state}
        end

      error ->
        error
    end
  end
end
