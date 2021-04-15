defmodule Broth.Message.User.Mute do
  use Broth.Message.Call
  @primary_key false
  embedded_schema do
    field(:value, :boolean)
  end

  # inbound data.
  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:value])
    |> validate_required([:value])
  end

  defmodule Reply do
    use Broth.Message.Push
    @derive {Jason.Encoder, only: []}
    @primary_key false
    embedded_schema do
    end
  end

  def execute(changeset, state) do
    with {:ok, request} <- apply_action(changeset, :validation) do
      {:reply, %Reply{}, state}
    end
  end
end
