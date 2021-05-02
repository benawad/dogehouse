defmodule Broth.Message.User.GetRelationship do
  # TO BE DEPRECATED IN FAVOR OF SOMETHING ELSE.  ONCE PRELOADS HAVE BEEN
  # FULLY OPTIMIZED, IT SHOULD BE POSSIBLE TO GLEAN THIS INFORMATION OFF
  # OF PRELOAD INFORMATION.

  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:userId, :binary_id)
  end

  alias Beef.Follows
  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:relationship]}

    @primary_key false
    embedded_schema do
      field(:relationship, Broth.Message.Types.Relationship)
    end
  end

  def execute(changeset, state = %{user: %{id: user_id}}) do
    case apply_action(changeset, :validate) do
      {:ok, %{userId: ^user_id}} ->
        {:reply, %Reply{relationship: :self}, state}

      {:ok, %{userId: user_id}} ->
        r =
          case Follows.get_info(state.user.id, user_id) do
            %{followsYou: false, youAreFollowing: false} -> nil
            %{followsYou: true, youAreFollowing: false} -> :follower
            %{followsYou: false, youAreFollowing: true} -> :following
            %{followsYou: true, youAreFollowing: true} -> :mutual
          end

        {:reply, %Reply{relationship: r}, state}

      error = {:error, _} ->
        error
    end
  end
end
