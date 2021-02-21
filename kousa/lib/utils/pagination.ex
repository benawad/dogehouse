defmodule Kousa.Pagination do
  def create_tuple(fetch_limit, items, offset) do
    {Enum.slice(items, 0, -1 + fetch_limit),
     if(length(items) == fetch_limit, do: -1 + offset + fetch_limit, else: nil)}
  end

  def create_tuple_cursor(_fetch_limit, [], _keys) do
    {[], nil}
  end

  def create_tuple_cursor(fetch_limit, items, keys) do
    sliced_items = Enum.slice(items, 0, -1 + fetch_limit)
    last_item = Enum.at(sliced_items, length(sliced_items) - 1)
    {sliced_items, Enum.join(Enum.map(keys, &Map.get(last_item, &1)), "|")}
  end
end
