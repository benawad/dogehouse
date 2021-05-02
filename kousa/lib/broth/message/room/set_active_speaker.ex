defmodule Broth.Message.Room.SetActiveSpeaker do
  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:active, :boolean)
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:active])
    |> validate_required([:active])
  end

  def execute(changeset, state = %{user: %{id: user_id}}) do
    with {:ok, %{active: active?}} <- apply_action(changeset, :validate),
         room_id when not is_nil(room_id) <- Beef.Users.get_current_room_id(user_id) do
      Onion.RoomSession.speaking_change(room_id, user_id, active?)
      {:noreply, state}
    else
      nil -> {:error, "not in a room"}
      error -> error
    end
  end
end
