defmodule Broth.Message.User.Follow do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:userId, :binary_id)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:userId])
    |> validate_required([:userId])
  end

  def execute(changeset, state) do
    with {:ok, %{userId: user_id}} <- apply_action(changeset, :validate) do
      Kousa.Follow.follow(state.user_id, user_id, true)
      {:noreply, state}
    end
  end
end
