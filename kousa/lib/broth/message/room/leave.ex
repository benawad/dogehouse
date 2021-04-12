defmodule Broth.Message.Room.Leave do
  @moduledoc """
  Note that this is different from `Broth.Message.Room.Update`, because this
  is a user-driven boolean value that translates into a MapSet in the parent
  struct; it is also a cast and not a call.

  Moreover, the security parameters for this are different from the security
  parameters of Update call.
  """

  use Broth.Message

  @primary_key false
  embedded_schema do
  end

  import Ecto.Changeset

  def changeset(changeset, _data), do: change(changeset)

  defmodule Reply do
    use Broth.Message

    @derive {Jason.Encoder, only: []}

    Module.register_attribute(__MODULE__, :reply_operation, persist: true)
    @reply_operation "you_left_room"

    @primary_key false
    embedded_schema do
      embed_error()
    end
  end
end
