defmodule Broth.Message.Room.Leave do
  @moduledoc """
  Note that this is different from `Broth.Message.Room.Update`, because this
  is a user-driven boolean value that translates into a MapSet in the parent
  struct; it is also a cast and not a call.

  Moreover, the security parameters for this are different from the security
  parameters of Update call.
  """

  use Broth.Message.Call

  @primary_key false
  embedded_schema do
  end

  def changeset(initializer \\ %__MODULE__{}, data) do
    change(initializer, data)
  end

  defmodule Reply do
    use Broth.Message.Push

    @derive {Jason.Encoder, only: []}

    @primary_key false
    embedded_schema do
    end
  end

  def execute(_, state) do
    case Kousa.Room.leave_room(state.user.id) do
      {:ok, _} ->
        {:reply, %Reply{}, state}

      _ ->
        {:noreply, state}
    end
  end
end
