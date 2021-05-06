defmodule Broth.Message.Call do
  @moduledoc """
  API contract statement for call message modules

  ## Usage:

  ```elixir
  using Broth.Message.Call, reply: <module>
  ```

  if you omit the reply module, it assumes the value
  `__MODULE__.Reply`

  performs compile-time checks to validate that the reply module
  is, indeed, a reply module.

  If this route can be used without authorization, set the
  `:needs_auth` keyword parameter to false.
  """

  alias Broth.Message.Cast

  defmacro __using__(opts) do
    default_reply_module = Module.concat(__CALLER__.module, Reply)

    reply_module =
      opts
      |> Keyword.get(:reply, default_reply_module)
      |> Macro.expand(__CALLER__)

    directions =
      if reply_module == __CALLER__.module do
        [:inbound, :outbound]
      else
        [:inbound]
      end

    auth_check =
      opts
      |> Keyword.get(:needs_auth, true)
      |> Cast.auth_check()

    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @behaviour Broth.Message.Call

      Module.register_attribute(__MODULE__, :directions, accumulate: true, persist: true)
      @directions unquote(directions)

      unquote(auth_check)
      unquote(Cast.schema_ast(opts))

      @impl true
      def reply_module, do: unquote(reply_module)

      @impl true
      def initialize(_state), do: struct(__MODULE__)

      defoverridable initialize: 1

      # verify compile-time guarantees
      @after_compile Broth.Message.Call
    end
  end

  alias Ecto.Changeset
  alias Broth.SocketHandler

  @callback auth_check(SocketHandler.state()) :: :ok | {:error, :auth}
  @callback reply_module() :: module
  @callback execute(Changeset.t(), SocketHandler.state()) ::
              {:reply, map, SocketHandler.state()}
              | {:noreply, SocketHandler.state()}
              | {:error, map, SocketHandler.state()}
              | {:error, Changeset.t()}
              | {:close, code :: 1000..9999, reason :: String.t()}

  @callback initialize(SocketHandler.state()) :: struct

  @callback changeset(struct | nil, Broth.json()) :: Ecto.Changeset.t()

  def __after_compile__(%{module: module}, _bin) do
    # checks to make sure you've either declared a schema module, or you have
    # implemented a schema
    Cast.check_for_schema(module, :inbound)

    # checks to make sure the declared reply module actually exists.
    reply_module = module.reply_module()
    Code.ensure_compiled(reply_module)

    Cast.check_for_schema(reply_module, :outbound)
  end
end
