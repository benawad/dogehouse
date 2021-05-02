defmodule Onion.StatsCache do
  use GenServer
  def start_link(_), do: GenServer.start_link(__MODULE__, nil, name: __MODULE__)

  @spec init(any) :: :ignore | {:ok, nil, :hibernate}
  def init(_) do
    :ets.new(__MODULE__, [:set, :public, :named_table])

    {:ok, nil, :hibernate}
  catch
    _, :badarg ->
      :ignore
  end

  def get(key) do
    case :ets.lookup(__MODULE__, key) do
      [{^key, value}] -> value
      [] -> nil
    end
  end

  # note it shouldn't be called "put" because that implies
  # returning back the same structure, this is a mutable
  # operation
  def set(key, value) do
    :ets.insert(__MODULE__, {key, value})
    :ok
  end

  def delete(key) do
    :ets.delete(__MODULE__, key)
    :ok
  end

  def reset do
    __MODULE__
    |> Process.whereis()
    |> Process.exit(:kill)
  end

  # atomic updates.  Consider guarding keys to be privileged
  # values, that are set up with default values in init/1
  def update_counter(key, increment) do
    :ets.update_counter(__MODULE__, key, increment)
    :ok
  end
end
