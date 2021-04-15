defmodule Broth.Message.Room.SetAuth do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:id, :binary_id)
    field(:level, Broth.Message.Types.RoomAuth)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:id, :level])
    |> validate_required([:id, :level])
    |> UUID.normalize(:id)
  end

  def execute(changeset, state) do
    with {:ok, %{id: user_id, level: level}} <- apply_action(changeset, :validate) do\
      Kousa.Room.set_auth(user_id, level, by: state.user_id)
      {:noreply, state}
    end
  end
end
