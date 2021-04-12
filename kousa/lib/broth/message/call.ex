defmodule Broth.Message.Call do
  @moduledoc """
  API contract statement for call message modules
  """

  defmacro __using__(_) do
    quote do
      use Ecto.Schema
      import Ecto.Changeset
      import Broth.Message, only: [embed_error: 0]
    end
  end

end


#  #########################################################################
#  # TOOLSET
#
#  # contracts.  Consider splitting into inbound and outbound
#
#  #@type t :: struct()
#  #@type reply :: struct()
##
#  ## TODO: fill out the correct 'term' value for the state
#  #@spec execute(t, state :: term) ::
#  #        {:reply, reply, state :: term}
#  #        | {:ok, state :: term}
#  #        | {:error, String.t()}
#  #        | {:close, integer, String.t()}
#
#  # TODO: make the struct definition more restrictive.
#  @callback changeset(map, Broth.SocketHandler.state) :: Ecto.Changeset.t
#  @callback changeset(t, map) :: Ecto.Changeset.t
#
#  defmacro __using__(opts) do
#    module = __CALLER__.module
#    default_reply_module = Module.concat(module, Reply)
#
#    reply_module = opts
#    |> Keyword.get(:call, default_reply_module)
#    |> Macro.expand_once(__CALLER__)
#
#    reply? = module
#    |> Module.split()
#    |> List.last()
#    |> Kernel.==("Reply")
#
#    reply_boilerplate = unless reply? do
#      quote do
#        @reply_module unquote(reply_module)
#        def reply_module, do: @reply_module
#      end
#    end
#
#    # if something defines both reply module and reply, compile error.
#    if reply? && opts[:reply_module] do
#      raise CompileError,
#        description: "module #{inspect __CALLER__.module} can't define a reply module"
#    end
#
#    quote do
#      use Ecto.Schema
#
#      unquote(reply_boilerplate)
#
#      import Broth.Message, only: [embed_error: 0]
#      import Ecto.Changeset
#
#      @after_compile Broth.Message
#      @behaviour Broth.Message
#    end
#  end
#
#
#  def __after_compile__(%{module: module}, _binary) do
#    if function_exported?(module, :reply_module, 0) do
#      if reply_module = module.reply_module() do
#        unless function_exported?(reply_module, :__schema__, 1) do
#          raise CompileError,
#            description:
#              "the reply module for #{inspect module} doesn't exist or isn't a schema"
#        end
#
#        unless :error in Map.keys(reply_module.__struct__()) do
#          raise CompileError,
#            description:
#              "the reply module #{inspect reply_module} doesn't have an error field"
#        end
#      end
#    end
#  end
