defmodule Broth.Message.User.GetBots do
  import Ecto.Query, warn: false
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
  end

  # userId is either a uuid or username
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [])
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
      id
      username
      displayName
      avatarUrl
      apiKey
    )a}

    @primary_key {:id, :binary_id, []}
    schema "users" do
      field(:username, :string)
      field(:displayName, :string)
      field(:avatarUrl, :string)
      field(:apiKey, :binary_id)

      belongs_to(:botOwner, Beef.Schemas.User, foreign_key: :botOwnerId, type: :binary_id)
    end
  end

  alias Beef.Repo
  alias Broth.SocketHandler

  def execute(changeset, %SocketHandler{} = state) do
    case apply_action(changeset, :validate) do
      {:ok, _} ->
        {:reply, %{bots: Repo.all(from(r in Reply, where: r.botOwnerId == ^state.user.id))},
         state}

      error ->
        error
    end
  end
end
