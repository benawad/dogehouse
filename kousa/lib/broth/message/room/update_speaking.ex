defmodule Broth.Message.Room.UpdateSpeaking do
  @moduledoc """
  Note that this is different from `Broth.Message.Room.Update`, because this
  is a user-driven boolean value that translates into a MapSet in the parent
  struct; it is also a cast and not a call.

  Moreover, the security parameters for this are different from the security
  parameters of Update call.
  """

  use Broth.Message.Cast

  @primary_key false
  embedded_schema do
    field(:isSpeaking, :boolean)
  end

  def changeset(changeset, data) do
    changeset
    |> cast(data, [:isSpeaking])
    |> validate_required([:isSpeaking])
  end
end
