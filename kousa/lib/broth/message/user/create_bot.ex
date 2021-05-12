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
  alias Beef.Schemas.User

  def execute(changeset!, state) do
    with {:ok, %{username: username}} <- apply_action(changeset!, :validation) do
      cond do
        Users.bot?(state.user.id) ->
          {:reply, %Reply{error: "bots can't create bots"}, state}

        Users.count_bot_accounts(state.user.id) > 4 ->
          {:reply, %Reply{error: "you've reached the max of 5 bot accounts"}, state}

        true ->
          case Users.create_bot(state.user.id, username) do
            {:ok, %User{apiKey: apiKey}} ->
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
