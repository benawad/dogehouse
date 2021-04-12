defmodule Broth.Message.Cast do
  @moduledoc """
  API contract statement for cast message modules
  """

  defmacro __using__(_) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset
    end
  end
end
