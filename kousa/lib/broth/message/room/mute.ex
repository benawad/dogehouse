defmodule Broth.Message.Room.Mute do
  use Broth.Message.Call
  @primary_key false
  embedded_schema do
    field(:muted, :boolean)
  end

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:muted])
    |> validate_required([:muted])
  end

  defmodule Reply do
    use Broth.Message.Push
    @derive {Jason.Encoder, only: []}
    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, %{muted: muted?}} <- apply_action(changeset, :validation) do
      Onion.UserSession.set_mute(state.user.id, muted?)
      {:reply, %Reply{}, state}
    end
  end
end
