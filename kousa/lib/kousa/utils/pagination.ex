defmodule Kousa.Utils.Pagination do
  @spec items_to_offset_tuple(list, pos_integer, pos_integer) :: {list, nil | number}
  def items_to_offset_tuple(items, offset, limit) do
    {Enum.slice(items, 0, -1 + limit),
     if(length(items) == limit, do: -1 + offset + limit, else: nil)}
  end

  def items_to_cursor_tuple([], _limit, _item_to_cursor) do
    {[], nil}
  end

  @spec items_to_cursor_tuple(list, pos_integer, (any -> String.t())) :: {list, nil | String.t()}
  def items_to_cursor_tuple(items, limit, item_to_cursor) do
    {Enum.slice(items, 0, -1 + limit),
     if(length(items) == limit,
       do: Enum.at(items, limit - 2) |> item_to_cursor.(),
       else: nil
     )}
  end
end
