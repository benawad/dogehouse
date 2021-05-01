defmodule Kousa.Search do
  alias Beef.Users
  alias Beef.Rooms

  def search(query) do
    %{
      users: Users.search_username(query),
      rooms: Rooms.search_name(query)
    }
  end
end
