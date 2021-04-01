defmodule Broth.Message.Room.Leave do
  @moduledoc """
  Note that this is different from `Broth.Message.Room.Update`, because this
  is a user-driven boolean value that translates into a MapSet in the parent
  struct; it is also a cast and not a call.

  Moreover, the security parameters for this are different from the security
  parameters of Update call.
  """

  use Ecto.Schema

  @primary_key false
  embedded_schema do end

  import Ecto.Changeset

  def changeset(changeset, _data), do: change(changeset)
end
