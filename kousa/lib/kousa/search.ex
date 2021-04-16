defmodule Kousa.Search do
  alias Beef.Users
  alias Beef.Rooms

  def search(query) do
    trimmed_query = String.trim(query)
    len = String.length(trimmed_query)

    cond do
      len < 2 or len > 100 -> []
      String.starts_with?(trimmed_query, "@") -> Users.search_username(trimmed_query)
      true -> Rooms.search_name(trimmed_query)
    end
  end
end
