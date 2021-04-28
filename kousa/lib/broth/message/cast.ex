defmodule Broth.Message.Cast do
  @moduledoc """
  API contract statement for cast message modules

  If this route can be used without authorization, set the
  `:needs_auth` keyword parameter to false.
  """

  import Broth.Message.Call, only: [auth_check: 1]

  defmacro __using__(opts) do
    # needs_auth defaults to true
    auth_check =
      opts
      |> Keyword.get(:needs_auth, true)
      |> auth_check()

    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Cast

      Module.register_attribute(__MODULE__, :directions, accumulate: true, persist: true)
      @directions [:inbound]

      unquote(auth_check)

      # default, overrideable intializer value

      @impl true
      def initialize(_state), do: struct(__MODULE__)
      defoverridable initialize: 1
    end
  end

  alias Broth.SocketHandler
  alias Ecto.Changeset

  @callback auth_check(SocketHandler.state()) :: :ok | {:error, :auth}

  @callback changeset(Broth.json()) :: Ecto.Changeset.t()
  @callback changeset(struct | nil, Broth.json()) :: Ecto.Changeset.t()

  @callback initialize(SocketHandler.state()) :: struct()

  @callback execute(Changeset.t(), SocketHandler.state()) ::
              {:noreply, SocketHandler.state()}
              | {:error, map, SocketHandler.state()}
              | {:error, Changeset.t()}
              | {:exit, code :: 1000..9999, reason :: String.t()}
end
