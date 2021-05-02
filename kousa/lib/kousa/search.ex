defmodule Kousa.Search do
  alias Beef.Users
  alias Beef.Rooms

  def search(query) do
    case String.trim(query) do
      Enum.concat(Rooms.search_name(query), Users.search_username(query))
    end
  end
end
