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
        [:outbound]
      end

    auth_check =
      opts
      |> Keyword.get(:needs_auth, true)
      |> auth_check()

    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @after_compile Broth.Message.Call

      @behaviour Broth.Message.Call

      Module.register_attribute(__MODULE__, :directions, accumulate: true, persist: true)
      @directions unquote(directions)

      unquote(auth_check)

      @impl true
      def reply_module, do: unquote(reply_module)

      @impl true
      def initialize(_state), do: struct(__MODULE__)

      defoverridable initialize: 1
    end
  end

  def auth_check(true) do
    quote do
      @impl true
      def auth_check(%{user: nil}), do: {:error, :auth}
      def auth_check(_), do: :ok
    end
  end

  def auth_check(false) do
    quote do
      @impl true
      def auth_check(_), do: :ok
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
  @callback changeset(Broth.json()) :: Ecto.Changeset.t()

  def __after_compile__(%{module: module}, _bin) do
    reply_module = module.reply_module()
    Code.ensure_loaded?(reply_module)

    unless :outbound in reply_module.__info__(:attributes)[:directions] do
      raise CompileError,
        description: "reply module #{inspect(reply_module)} does not seem to be a outbound module"
    end
  end
end
