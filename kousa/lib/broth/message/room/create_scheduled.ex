defmodule Broth.Message.Room.CreateScheduled do
  use Broth.Message.Call,
    reply: __MODULE__,
    operation: "room:create_scheduled:reply"

  schema "scheduled_room" do
    field :room, :string
  end

  def execute(data, state) do
    # TODO: revisit this contract.
    case Kousa.Room.create_room(
      state.user_id,
      data.name,
      data.description,
      data.isPrivate,
      data.userIdsToInvite) do
      {:ok, %{room: room}} ->
        {:reply, Map.from_struct(room), state}
      error = {:error, _} ->
        {:reply, %{error: error}}
    end
  end
end
