defmodule Broth.Message.User.CreateBot do
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
        error
      )a}

    @primary_key false
    embedded_schema do
      field(:apiKey, :string)
      field(:isUsernameTaken, :boolean)
      # @todo conver to proper error handling
      field(:error, :string)
    end
  end

  alias Beef.Users

  def execute(changeset!, state) do
    with {:ok, %{username: username}} <- apply_action(changeset!, :validation) do
      if Users.count_bot_accounts(state.user_id) > 99 do
        {:reply, %Reply{error: "you've reached the max of 100 bot accounts"}, state}
      else
        case Users.create_bot(state.user_id, username) do
          {:ok, %{apiKey: apiKey}} ->
            {:reply, %Reply{apiKey: apiKey}, state}

          {:error,
           %Ecto.Changeset{
             errors: [username: {"has already been taken", _}]
           }} ->
            {:reply, %Reply{isUsernameTaken: true}, state}
        end
      end
    end
  end
end
