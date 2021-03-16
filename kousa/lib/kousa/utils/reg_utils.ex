defmodule Kousa.Utils.RegUtils do
  @spec lookup_and_call(atom | :ets.tid(), any, any) :: {:err, {:error, :not_found}} | {:ok, any}
  def lookup_and_call(table, id, params) do
    case GenRegistry.lookup(table, id) do
      {:ok, session} ->
        {:ok, GenServer.call(session, params)}

      err ->
        {:err, err}
    end
  end

  def lookup_and_cast(table, id, params) do
    case GenRegistry.lookup(table, id) do
      {:ok, session} ->
        {:ok, GenServer.cast(session, params)}

      err ->
        {:err, err}
    end
  end
end
