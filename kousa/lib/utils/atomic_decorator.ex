defmodule Kousa.Dec.Atomic do
  # this should be deprecated over time.  Should not be necessary.

  use Decorator.Define, user_atomic: 0

  def user_atomic(body, %{args: args, name: fn_name}) do
    quote do
      user_id = Enum.at(unquote(args), 0)

      case GenRegistry.lookup(Kousa.Gen.UserSession, user_id) do
        {:ok, session} ->
          case GenServer.call(session, {:start_atomic_op, Atom.to_string(unquote(fn_name))}) do
            :err ->
              nil

            :ok ->
              return_value = unquote(body)
              GenServer.cast(session, {:done_with_atomic_op})
              return_value
          end

        err ->
          nil
      end
    end
  end
end
