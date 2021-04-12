defmodule Broth.Message.Room.CreateScheduled do
  use Broth.Message, call: __MODULE__

  schema "scheduled_room" do
    embed_error()
  end

  import Ecto.Changeset
end
