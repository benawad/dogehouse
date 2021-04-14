defmodule Broth.Message.Push do
  @moduledoc """
  API contract statement for push message modules
  """

  defmacro __using__(_opts) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Push

      Module.register_attribute(__MODULE__, :directions, accumulate: true, persist: true)
      @directions [:outbound]
    end
  end

  @callback changeset(Broth.json()) :: Ecto.Changeset.t()
  @callback operation() :: String.t()

  @optional_callbacks [changeset: 1, operation: 0]
end
