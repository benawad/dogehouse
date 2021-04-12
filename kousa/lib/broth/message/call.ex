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
  """

  defmacro __using__(opts) do
    default_reply_module = Module.concat(__CALLER__.module, Reply)
    reply_module = opts
    |> Keyword.get(:reply, default_reply_module)
    |> Macro.expand(__CALLER__)

    operation = if op = Keyword.get(opts, :operation) do
      quote do
        @impl true
        def operation, do: unquote(op)
      end
    end

    quote do
      use Ecto.Schema
      import Ecto.Changeset

      @after_compile Broth.Message.Call

      @behaviour Broth.Message.Call

      unquote(operation)

      @impl true
      def reply_module, do: unquote(reply_module)
    end
  end

  alias Ecto.Changeset
  alias Broth.SocketHandler

  @callback reply_module() :: module
  @callback operation() :: String.t
  @callback execute(Changeset.t, SocketHandler.state) ::
    {:reply, map, SocketHandler.state} |
    {:noreply, SocketHandler.state} |
    {:error, map, SocketHandler.state} |
    {:error, Changeset.t} |
    {:exit, code :: 1000..9999, reason :: String.t}

  @callback change_input(Broth.json) :: Ecto.Changeset.t

  @optional_callbacks [operation: 0]

  def __after_compile__(%{module: module}, _bin) do
    reply_module = module.reply_module()
    Code.ensure_loaded?(reply_module)
    unless function_exported?(reply_module, :operation, 0) do
      raise CompileError, description: "#{module.reply_module} does not seem to be a Broth.Message.Push module"
    end
  end
end
