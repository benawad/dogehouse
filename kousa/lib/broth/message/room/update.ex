defmodule Broth.Message.Room.Update do
  use Broth.Message, call: __MODULE__

  @primary_key false
  schema "rooms" do
    embed_error()
  end

  def room_changeset(changeset, data) do
    cast(changeset, data, ~w(description isPrivate name autoSpeaker)a)
  end
end
