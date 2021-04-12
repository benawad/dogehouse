defmodule Broth.Message.Push do
  @moduledoc """
  API contract statement for push message modules
  """

  defmacro __using__(_) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset
      import Broth.Message, only: [embed_error: 0]
    end
  end
end
