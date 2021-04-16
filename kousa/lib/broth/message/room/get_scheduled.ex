defmodule Broth.Message.Room.GetScheduled do
  use Broth.Message.Call

  @primary_key false
  embedded_schema do
    field(:all, :boolean, default: true)
  end

  alias Kousa.Utils.UUID

  def changeset(initializer \\ %__MODULE__{}, data) do
    initializer
    |> cast(data, [:all])
  end

  defmodule Reply do
    use Broth.Message.Push
    # TODO: revise this.

    @derive {Jason.Encoder, only: [:rooms]}

    embedded_schema do
      field(:rooms, {:array, :map})
    end
  end

  def execute(changeset, state) do
    with {:ok, %{all: all?}} <- apply_action(changeset, :validate) do
      if all? do
        raise "not implemented yet"
      else
        rooms = Kousa.ScheduledRoom.get_my_scheduled_rooms_about_to_start(state.user_id)
        {:reply, %Reply{rooms: rooms}, state}
      end
    end
  end
end
