defmodule Broth.Message.Bot.Create do
  use Broth.Message.Call,
    reply: __MODULE__

  @derive {Jason.Encoder, only: [:username]}

  @primary_key {:id, :binary_id, []}
  schema "users" do
    field(:username, :string)
  end

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:username])
    |> validate_required([:username])
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: ~w(
        apiKey
        isUsernameTaken
      )a}

    @primary_key false
    embedded_schema do
      field(:apiKey, :string)
      field(:isUsernameTaken, :boolean)
    end
  end

  alias Beef.Bots

  def execute(changeset!, state) do
    with {:ok, %{username: username}} <- apply_action(changeset!, :validation) do
      case Bots.create(state.user_id, username) do
        {:ok, %{apiKey: apiKey}} ->
          {:reply, %Reply{apiKey: apiKey}, state}

        {:error,
         %Ecto.Changeset{
           changes: %{bot: %Ecto.Changeset{errors: [username: {"has already been taken", _}]}}
         }} ->
          {:reply, %Reply{isUsernameTaken: true}, state}
      end
    end
  end
end
