defmodule Broth.Message.Push do
  @moduledoc """
  API contract statement for push message modules
  """

  defmacro __using__(opts) do
    operation = Keyword.fetch!(opts, :operation)

    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Push

      @impl true
      def operation, do: unquote(operation)
    end
  end

  @callback changeset(Broth.json()) :: Ecto.Changeset.t()

  @callback operation :: String.t()
  @callback change_output(map) :: Ecto.Changeset.t()

  @optional_callbacks [changeset: 1]
end
