defmodule Kousa.Pagination do
  @spec items_to_cursor_tuple(list, pos_integer, pos_integer) :: {list, nil | number}
  def items_to_cursor_tuple(items, offset, limit) do
    {Enum.slice(items, 0, -1 + limit),
     if(length(items) == limit, do: -1 + offset + limit, else: nil)}
  end
end
