defmodule Broth.Message.Cast do
  @moduledoc """
  API contract statement for cast message modules
  """

  defmacro __using__(_) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Cast

      Module.register_attribute(__MODULE__, :directions, accumulate: true, persist: true)
      @directions [:inbound]

      # default, overrideable intializer value

      @impl true
      def initialize(_state), do: struct(__MODULE__)
      defoverridable initialize: 1
    end
  end

  alias Broth.SocketHandler
  alias Ecto.Changeset

  @callback changeset(Broth.json()) :: Ecto.Changeset.t()
  @callback changeset(struct | nil, Broth.json()) :: Ecto.Changeset.t()

  @callback initialize(SocketHandler.state()) :: struct()

  @callback execute(Changeset.t(), SocketHandler.state()) ::
              {:noreply, SocketHandler.state()}
              | {:error, map, SocketHandler.state()}
              | {:error, Changeset.t()}
              | {:exit, code :: 1000..9999, reason :: String.t()}
end
