defmodule Broth.Message.Room.Deafen do
  use Broth.Message.Call
  @primary_key false
  embedded_schema do
    field(:deafened, :boolean)
  end

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:deafened])
    |> validate_required([:deafened])
  end

  defmodule Reply do
    use Broth.Message.Push
    @derive {Jason.Encoder, only: []}
    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, %{deafened: deafened?}} <- apply_action(changeset, :validation) do
      Onion.UserSession.set_deafen(state.user.id, deafened?)
      {:reply, %Reply{}, state}
    end
  end
end
