defmodule Broth.Message.User.GetInfo do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    # required.
    field(:userId, :binary_id)
  end

  alias Kousa.Utils.UUID

  def initialize(state) do
    %__MODULE__{userId: state.user_id}
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
    |> UUID.normalize(:userId)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: [:id, :username, :displayName, :avatarUrl, :bio]}

    @primary_key {:id, :binary_id, []}
    schema "users" do
      field(:username, :string)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:bio, :string, default: "")
    end
  end

  alias Beef.Repo

  def execute(changeset, state) do
    case apply_action(changeset, :validate) do
      {:ok, %{userId: user_id}} ->
        {:reply, Repo.get(Reply, user_id), state}

      error ->
        error
    end
  end
end
