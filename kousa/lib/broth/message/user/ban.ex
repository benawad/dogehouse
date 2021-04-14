defmodule Broth.Message.User.Ban do
  use Broth.Message.Call

  @primary_key {:id, :binary_id, []}
  embedded_schema do
    field(:reason, :string)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id, :reason])
    |> validate_required([:id, :reason])
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: []}

    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validate),
         :ok <- Kousa.User.ban(request.id, request.reason, admin_id: state.user_id) do
      {:reply, %Reply{}, state}
    end
  end
end
